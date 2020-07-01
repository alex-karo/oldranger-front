import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb, message, notification, Spin, Typography, Button, Result } from 'antd';
import Comment from 'antd/es/comment';
import { Markup } from 'interweave';
import Album from '../Profile/Albums/Album';
import TopicCommentsList from './TopicCommentsList';
import queries from '../../serverQueries';
import { GoldIcon, ReplyFloatButton, TopicCommentReplyAlert, TopicReplyWarning } from './styled';
import TopicReplyForm from './TopicReplyForm';
import TopicCommentItem from './TopicCommentItem';
import TopicStartMessage from './TopicStartMessage';
import Context from '../Context';
import withGetUserProfile from '../hoc/withGetUserProfile';
import UserAvatar from '../commons/UserAvatar';

const { Text } = Typography;

class TopicPage extends React.Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const query = new URLSearchParams(location.search);
    this.state = {
      topic: null,
      messages: [],
      page: query.get('page') || 1,
      reply: null,
      answerId: null,
      files: [],
      uploading: false,
      lightboxIsOpen: false,
      error: false,
    };
    this.replyForm = React.createRef();
  }

  async componentDidMount() {
    const { page } = this.state;
    await this.getTopics(parseInt(page, 10));
  }

  getTopics = page => {
    // Get a topic and a list of comments for this topic by topic id
    const { match } = this.props;
    if (page === 1) {
      queries
        .getTopic(match.params.topicId, 0, 10)
        .then(({ topic, commentDto, subscribed }) => {
          this.setState({
            topic: { ...topic, isSubscribed: subscribed },
            page,
            messages: commentDto ? commentDto.content : null,
            error: false,
          });
        })
        .catch(() => {
          this.setState({ error: true });
        });
    } else {
      queries
        .getTopic(match.params.topicId, page - 1, 10)
        .then(({ topic, commentDto, subscribed }) => {
          this.setState({
            topic: { ...topic, isSubscribed: subscribed },
            page,
            messages: commentDto ? commentDto.content : null,
            error: false,
          });
        })
        .catch(() => {
          this.setState({ error: true });
        });
    }
  };

  changePageHandler = page => {
    const { history } = this.props;
    history.push(`${history.location.pathname}?page=${page}`);
    this.getTopics(page);
  };

  replyButtonHandler = () => {
    this.replyForm.focus();
  };

  handleQuoteComment = comment => () => {
    const { isLogin } = this.context;
    if (isLogin) {
      this.replyForm.focus();
      this.setState({
        reply: {
          replyDateTime: comment.commentDateTime,
          replyNick: comment.author.nickName,
          replyText: comment.commentText,
        },
        answerId: comment.commentId,
      });
    } else {
      this.openNotification();
    }
  };

  handleSubmitComment = async (messageText, resetForm) => {
    if (messageText === '') {
      notification.open({
        message: 'Сообщение не может быть пустым',
        description: 'Максимальное количество символов 500000',
        icon: <GoldIcon type="warning" />,
      });
      return;
    }

    this.setState({ uploading: true });
    const { topic, answerId, files } = this.state;
    const { user } = this.context;
    const { history } = this.props;
    const messageComentsEntity = {
      idTopic: topic.id,
      idUser: user.id,
      text: messageText.trim(),
    };

    if (answerId) {
      messageComentsEntity.answerID = answerId;
    }

    [messageComentsEntity.image1, messageComentsEntity.image2] = files;
    try {
      await queries.addComment(messageComentsEntity);
      const lastPage = Math.floor(topic.messageCount / 10 + 1);
      history.push(`${history.location.pathname}?page=${lastPage}`);
      this.getTopics(lastPage);
      message.success('Ваше сообщение успешно добавлено');
      this.setState({ reply: null, answerId: null, files: [], uploading: false });
      resetForm();
    } catch {
      message.error('Похоже, что-то не так. Сообщение добавить не удалось.');
      this.setState({ uploading: false });
    }
  };

  handleDeleteComment = commentId => {
    const { page, messages } = this.state;
    const { history } = this.props;

    if (messages.length === 1 && page === 1) {
      history.push(`${history.location.pathname}?page=${page}`);
      queries
        .deleteComment(commentId)
        .then(() => {
          history.push(`${history.location.pathname}?page=${page}`);
          this.getTopics(page);
          message.success('Сообщение удалено');
        })
        .catch(() => {
          message.error('Похоже, что-то не так. Сообщение удалить не удалось.');
        });
      return;
    }

    if (messages.length === 1 && page > 1) {
      queries
        .deleteComment(commentId)
        .then(() => {
          history.push(`${history.location.pathname}?page=${page - 1}`);
          this.getTopics(page - 1);
          message.success('Сообщение удалено');
        })
        .catch(() => {
          message.error('Похоже, что-то не так. Сообщение удалить не удалось.');
        });
      return;
    }

    queries
      .deleteComment(commentId)
      .then(() => {
        history.push(`${history.location.pathname}?page=${page}`);
        this.getTopics(page);
        message.success('Сообщение удалено');
      })
      .catch(() => {
        message.error('Похоже, что-то не так. Сообщение удалить не удалось.');
      });
  };

  openNotification = () => {
    notification.open({
      message: 'Требуется авторизация',
      description: 'Только зарегистрированные пользователи могут оставлять комментарии.',
      icon: <GoldIcon type="warning" />,
    });
  };

  handleCancelReply = () => {
    this.setState({ reply: null, answerId: null });
  };

  handleAddFile = info => {
    this.setState({ files: info.fileList });
    if (info.file.status !== 'removed') {
      message.success(`Файл ${info.file.name} успешно добавлен`);
    }
  };

  toggleLightbox = () => {
    this.setState(state => ({
      lightboxIsOpen: !state.lightboxIsOpen,
    }));
  };

  toggleSubscriptionStatus = () => {
    const {
      topic: { id: topicId, isSubscribed },
    } = this.state;
    const setSubscriptionState = newSubscriptionState => {
      this.setState(({ topic }) => ({
        topic: {
          ...topic,
          isSubscribed: newSubscriptionState,
        },
      }));
    };
    const addSubscription = () => {
      queries.addTopicToSubscriptions(topicId).catch(() => {
        setSubscriptionState(false);
        message.error('Что-то пошло не так, топик не добавлен');
      });
    };
    const deleteSubscription = () => {
      queries.deleteTopicFromSubscriptions(topicId).catch(() => {
        setSubscriptionState(true);
        message.error('Что-то пошло не так, топик не удален');
      });
    };
    setSubscriptionState(!isSubscribed);
    if (!isSubscribed) {
      addSubscription();
    } else {
      deleteSubscription();
    }
  };

  createAlbumProp = topic => {
    const albumProps = {
      state: {
        photoAlbumId: topic.photoAlbum.id,
        title: topic.photoAlbum.title,
      },
    };
    return albumProps;
  };

  render() {
    const { messages, topic, page, reply, files, uploading, error } = this.state;
    const { userProfile } = this.props;
    const { isLogin } = this.context;
    const avatar = userProfile.avatar ? (
      <UserAvatar src={userProfile.avatar} alt="User Avatar" />
    ) : null;
    return error ? (
      <Result
        status="403"
        title="403"
        subTitle="Извините, вы не авторизованы для доступа к этой странице."
        extra={
          <Button type="primary">
            <Link to="/login">Авторизироваться</Link>
          </Button>
        }
      />
    ) : (
      <div>
        {topic ? (
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">Главная</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/section/${topic.section.id}`}>{topic.section.name}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/subsection/${topic.subsection.id}`}>{topic.subsection.name}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/topic/${topic.id}`}>{topic.name}</Link>
              </Breadcrumb.Item>
            </Breadcrumb>
            <TopicStartMessage topic={topic} toggleLightbox={this.toggleLightbox} />
            {topic.photoAlbum ? <Album topicPageProp={this.createAlbumProp(topic)} /> : null}
            {isLogin && (
              <Button onClick={this.toggleSubscriptionStatus}>
                {topic.isSubscribed ? 'Отписаться' : 'Подписаться'}
              </Button>
            )}
            <TopicCommentsList
              changePageHandler={this.changePageHandler}
              messages={messages}
              itemComponent={item => (
                <TopicCommentItem
                  comment={item}
                  handleQuoteComment={this.handleQuoteComment}
                  deleteComment={this.handleDeleteComment}
                  getTopics={this.getTopics}
                  page={page}
                />
              )}
              total={topic.messageCount}
              page={page}
              replyButtonHandler={this.replyButtonHandler}
              openNotification={this.openNotification}
            />
          </div>
        ) : (
          <Spin />
        )}
        {reply && (
          <TopicCommentReplyAlert
            type="success"
            closeText="Отменить комментирование"
            onClose={this.handleCancelReply}
            message={
              <>
                <span>
                  Ответ на сообщение пользователя <Text strong>{reply.replyNick}</Text>
                </span>
                <Markup content={reply.replyText} />
              </>
            }
          />
        )}
        {isLogin ? (
          <Comment
            avatar={avatar}
            content={
              <TopicReplyForm
                replyRef={element => {
                  this.replyForm = element;
                }}
                handleSubmitComment={this.handleSubmitComment}
                handleAddFile={this.handleAddFile}
                files={files}
                uploading={uploading}
              />
            }
          />
        ) : (
          <TopicReplyWarning>
            Для возможности добавлять комментарии необходимо{' '}
            <Link to="/login">авторизироваться</Link>.
          </TopicReplyWarning>
        )}
        <ReplyFloatButton
          type="primary"
          icon="message"
          onClick={isLogin ? this.replyButtonHandler : this.openNotification}
        >
          Ответить
        </ReplyFloatButton>
      </div>
    );
  }
}

TopicPage.defaultProps = {
  userProfile: {},
};

TopicPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }).isRequired,
  userProfile: PropTypes.shape({
    userId: PropTypes.number,
    nickName: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    birthday: PropTypes.string,
    gender: PropTypes.string,
    phoneNumber: PropTypes.string,
    socialFb: PropTypes.string,
    socialTw: PropTypes.string,
    socialVk: PropTypes.string,
    aboutMe: PropTypes.string,
    regDate: PropTypes.string,
    messageCount: PropTypes.number,
    topicStartCount: PropTypes.number,
    lastComment: PropTypes.string,
    lastVisit: PropTypes.string,
    avatar: PropTypes.string,
    owner: PropTypes.bool,
    user: PropTypes.bool,
  }),
};

TopicPage.contextType = Context;

export default withGetUserProfile(withRouter(TopicPage));

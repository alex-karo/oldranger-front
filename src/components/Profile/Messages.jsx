import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { Row, message, Spin } from 'antd';
import queries from '../../serverQueries';
import TopicCommentsList from '../Topic/TopicCommentsList';
import TopicCommentItem from '../Topic/TopicCommentItem';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      hasMore: true,
      inProgress: true,
      page: 1,
    };
  }

  componentDidMount() {
    this.loadMessages();
  }

  loadMessages = async () => {
    const { page: oldPage } = this.state;
    const newMessages = await queries.getProfileComments(oldPage);
    if (newMessages.length === 0) {
      return this.setState({ hasMore: false });
    }

    return this.setState(({ messages, page }) => ({
      messages: [...messages, ...newMessages],
      page: page + 1,
      inProgress: false,
    }));
  };

  handleUpdateMessage = updatedComment => {
    this.setState(({ messages }) => {
      const updatedComments = messages.map(mes =>
        mes.commentId === updatedComment.commentId ? updatedComment : mes
      );
      return { messages: updatedComments };
    });
  };

  handleDeleteMessage = commentId => {
    queries
      .deleteComment(commentId)
      .then(() => {
        this.setState(({ messages }) => {
          const updatedComments = messages.filter(mes => mes.commentId !== commentId);
          return { messages: updatedComments };
        });
        message.success('Сообщение удалено');
      })
      .catch(() => {
        message.error('Похоже, что-то не так. Сообщение удалить не удалось.');
      });
  };

  getPageComment = numberComment => {
    return Math.ceil(numberComment / 10);
  };

  render() {
    const { hasMore, messages, inProgress } = this.state;

    if (messages.length === 0 && !hasMore) {
      return (
        <Row type="flex" justify="center">
          <h4>Сообщений нет</h4>
        </Row>
      );
    }

    if (inProgress) return <Spin />;

    return (
      <TopicCommentsList
        itemComponent={item => (
          <HashLink
            to={`/topic/${item.topicId}?page=${this.getPageComment(item.positionInTopic)}#${
              item.positionInTopic
            }`}
          >
            <TopicCommentItem
              comment={item}
              updateComment={this.handleUpdateMessage}
              deleteComment={this.handleDeleteMessage}
            />
          </HashLink>
        )}
        messages={messages}
        title=""
        fetchMessages={this.loadMessages}
        hasMore={hasMore}
      />
    );
  }
}

export default Messages;

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Popover, Tooltip, Icon } from 'antd';
import { parseISO, formatDistanceToNow } from 'date-fns';
import ru from 'date-fns/locale/ru';
import PropTypes from 'prop-types';
import { Markup } from 'interweave';
import { ReplyTag, DeletedMessageText } from './styled';
import TopicEditingForm from './TopicEditingForm';
import commentProps from './propTypes/commentProps';
import TopicCommentListItem from './TopicCommentListItem';
import Context from '../Context';
import { userRoles, SECURED_ALBUM_URL, DEFAULT_COMMENT_PICTURE } from '../../constants';

const IconText = ({ type, onHandleClick, title }) => (
  <Tooltip placement="topRight" title={title}>
    <span onClick={onHandleClick}>
      <Icon type={type} theme="twoTone" />
    </span>
  </Tooltip>
);

class TopicCommentItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleEdeting: false,
      withActions: true,
    };
  }

  handleClickEditBtn = () => {
    this.setState({ toggleEdeting: true, withActions: false });
  };

  handleCancel = () => {
    this.setState({ toggleEdeting: false, withActions: true });
  };

  showFieldOrNot() {
    const { user } = this.context;
    const { comment } = this.props;
    if (comment.deleted) {
      return false;
    }
    return (
      (user.id === comment.author.id && comment.updatable === true) ||
      user.role === userRoles.admin ||
      user.role === userRoles.moderator
    );
  }

  showReplyLinkOrNot() {
    const { comment } = this.props;
    return !comment.deleted;
  }

  render() {
    const {
      user: { mute },
    } = this.context;
    const muteComments = mute && mute.includes('ON_COMMENTS');
    const {
      comment,
      handleQuoteComment,
      deleteComment,
      getTopics,
      page,
      updateComment,
    } = this.props;
    const { withActions, toggleEdeting } = this.state;
    const { isLogin } = this.context;
    const convertedImages = comment.photos.map(photo => {
      const url = isLogin
        ? `${SECURED_ALBUM_URL}${photo.id}?type=small`
        : `${DEFAULT_COMMENT_PICTURE}`;
      return {
        uid: `-${String(photo.id)}`,
        url,
        name: `Photo_name_${photo.description}`,
        status: 'done',
      };
    });

    const commentActions = [
      <span key="comment-basic-position">#{comment.positionInTopic}</span>,
      this.showReplyLinkOrNot() ? (
        <span
          key="comment-basic-reply-to"
          onClick={handleQuoteComment(comment)}
          onKeyPress={handleQuoteComment(comment)}
          role="button"
          tabIndex="0"
        >
          Ответить на сообщение {comment.author.nickName}
        </span>
      ) : null,
      this.showFieldOrNot() ? (
        <IconText type="edit" onHandleClick={this.handleClickEditBtn} title="Редактировать" />
      ) : null,
      this.showFieldOrNot() ? (
        <IconText
          type="delete"
          onHandleClick={() => {
            deleteComment(comment.commentId);
          }}
          title="Удалить"
        />
      ) : null,
    ];

    const contentCommentText = comment.deleted ? (
      <DeletedMessageText type="secondary">
        <Markup content={comment.commentText} />
      </DeletedMessageText>
    ) : (
      <Markup content={comment.commentText} />
    );

    const contentReplyText = comment.replyNick ? (
      <Popover
        content={<Markup content={comment.replyText} />}
        title={`${comment.replyNick}, ${formatDistanceToNow(parseISO(comment.replyDateTime), {
          locale: ru,
          addSuffix: true,
        })}`}
        placement="topLeft"
      >
        <ReplyTag green>
          ответил на комментарий <strong>{comment.replyNick}</strong>
        </ReplyTag>
      </Popover>
    ) : null;

    const contentEditingForm = (
      <TopicEditingForm
        edetingText={comment.commentText}
        fileList={convertedImages}
        handleCancel={this.handleCancel}
        idTopic={comment.topicId}
        idUser={comment.author.id}
        commentId={comment.commentId}
        getTopics={getTopics}
        updateComment={updateComment}
        page={page}
      />
    );

    return (
      <TopicCommentListItem
        comment={comment}
        withActions={withActions}
        toggleEdeting={toggleEdeting}
        convertedImages={convertedImages}
        commentActions={commentActions}
        muteComments={muteComments}
        contentCommentText={contentCommentText}
        contentEditingForm={contentEditingForm}
        contentReplyText={contentReplyText}
      />
    );
  }
}

TopicCommentItem.contextType = Context;

IconText.propTypes = {
  type: PropTypes.string.isRequired,
  onHandleClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

TopicCommentItem.propTypes = {
  comment: commentProps.isRequired,
  handleQuoteComment: PropTypes.func,
  deleteComment: PropTypes.func,
  getTopics: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  updateComment: PropTypes.func,
};

TopicCommentItem.defaultProps = {
  handleQuoteComment: () => {},
  deleteComment: () => {},
  updateComment: undefined,
};

export default TopicCommentItem;

import React from 'react';
import { Comment, Popover, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { dataToFormatedDate, dateToDateDistance } from '../../utils';
import { ListItem } from './styled';
import TopicUserInfo from './TopicUserInfo';
import commentProps from './propTypes/commentProps';
import UserAvatar from '../commons/UserAvatar';

const TopicCommentListItem = ({
  comment,
  withActions,
  toggleEdeting,
  commentActions,
  contentEditingForm,
  contentCommentText,
  contentReplyText,
  muteComments,
}) => {
  const commentDateTooltipString = comment.commentUpdateTime
    ? `Создан ${dataToFormatedDate(comment.commentDateTime)}, отредактирован ${dataToFormatedDate(
        comment.commentUpdateTime
      )}`
    : `Создан ${dataToFormatedDate(comment.commentDateTime)}`;
  const commentDateString = comment.commentUpdateTime
    ? `Создан ${dateToDateDistance(
        comment.commentDateTime,
        true
      )}, отредактирован ${dateToDateDistance(comment.commentUpdateTime, true)}`
    : `Создан ${dateToDateDistance(comment.commentDateTime, true)}`;

  return (
    <ListItem id={comment.positionInTopic}>
      <Comment
        actions={withActions && !muteComments ? commentActions : null}
        author={
          !contentReplyText ? (
            comment.author.nickName
          ) : (
            <span>
              {comment.author.nickName} {contentReplyText}
            </span>
          )
        }
        avatar={
          <Popover
            content={
              <TopicUserInfo user={{ ...comment.author, messageCount: comment.messageCount }} />
            }
            placement="right"
          >
            <UserAvatar src={comment.author.avatar.small} />
          </Popover>
        }
        content={toggleEdeting ? contentEditingForm : contentCommentText}
        datetime={
          <Tooltip title={commentDateTooltipString}>
            <span>{commentDateString}</span>
          </Tooltip>
        }
      />
    </ListItem>
  );
};

export default TopicCommentListItem;

TopicCommentListItem.defaultProps = {
  withActions: false,
  contentReplyText: null,
  muteComments: false,
};

TopicCommentListItem.propTypes = {
  withActions: PropTypes.bool,
  muteComments: PropTypes.bool,
  toggleEdeting: PropTypes.bool.isRequired,
  commentActions: PropTypes.node.isRequired,
  contentEditingForm: PropTypes.node.isRequired,
  contentCommentText: PropTypes.node.isRequired,
  comment: commentProps.isRequired,
  contentReplyText: PropTypes.node,
};

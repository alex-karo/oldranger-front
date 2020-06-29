import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { parseISO, format, formatDistanceToNow } from 'date-fns';

import ru from 'date-fns/locale/ru';
import PropTypes from 'prop-types';
import { Button, Comment, Form, List, Input, Tooltip } from 'antd';

const { TextArea } = Input;

const Editor = data => {
  const { onChange, onSubmit, value, idPhoto } = data;
  return (
    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" onClick={() => onSubmit(idPhoto)} type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </>
  );
};

function formatDateToLocalTimeZone(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const dates = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const result = new Date(Date.UTC(year, month, dates, hours, minutes, seconds));
  return result;
}

function ModalPhoto(props) {
  const { src, currentComments, addComment, idPhoto } = props;

  const [newCommentText, setNewCommentText] = useState('');

  const handleSubmit = async () => {
    if (!newCommentText) {
      return;
    }
    const data = { idPhoto, commentText: newCommentText };
    addComment(data);
    setNewCommentText('');
  };

  const handleChange = event => {
    const { value } = event.target;
    setNewCommentText(value);
  };

  currentComments.sort((commentA, commentB) => {
    return commentB.positionInPhoto - commentA.positionInPhoto;
  });

  const CommentList = () => (
    <List
      dataSource={currentComments}
      renderItem={item => {
        const { author, commentText, commentDateTime } = item;
        return (
          <li style={{ backgroundColor: 'white' }}>
            <Comment
              author={author.username}
              content={commentText}
              datetime={
                <Tooltip
                  title={format(
                    formatDateToLocalTimeZone(parseISO(commentDateTime)),
                    "dd MMMM yyyy 'в' HH:mm",
                    {
                      locale: ru,
                    }
                  )}
                >
                  <span>
                    {formatDistanceToNow(formatDateToLocalTimeZone(parseISO(commentDateTime)), {
                      locale: ru,
                      addSuffix: true,
                    })}
                  </span>
                </Tooltip>
              }
            />
          </li>
        );
      }}
    />
  );

  const formAddComment = () => (
    <Comment
      content={
        <Editor
          onChange={handleChange}
          onSubmit={handleSubmit}
          value={newCommentText}
          idPhoto={idPhoto}
        />
      }
    />
  );

  return (
    <>
      <StyledImage src={src} />
      {formAddComment()}
      {currentComments.length > 0 && <CommentList comments={currentComments} />}
    </>
  );
}

const StyledImage = styled.img`
  object-fit: cover;
  object-position: top center;
  width: 100%;
`;

ModalPhoto.propTypes = {
  idPhoto: PropTypes.number.isRequired,
  currentComments: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])),
  src: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
};

ModalPhoto.defaultProps = {
  currentComments: [],
};

export default withRouter(ModalPhoto);

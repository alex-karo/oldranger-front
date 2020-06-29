import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button, Comment, Form, List, Input } from 'antd';

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

function ModalPhoto(props) {
  const { src, currentComments, addComment, idPhoto } = props;
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async () => {
    if (!commentText) {
      return;
    }
    const data = { idPhoto, commentText };
    addComment(data);
    setCommentText('');
  };

  const handleChange = event => {
    const { value } = event.target;
    setCommentText(value);
  };

  currentComments.sort((commentA, commentB) => {
    return commentB.positionInPhoto - commentA.positionInPhoto;
  });

  const CommentList = () => (
    <List
      dataSource={currentComments}
      renderItem={item => {
        return (
          <li style={{ backgroundColor: 'white' }}>
            <Comment author={item.author.username} content={item.commentText} />
          </li>
        );
      }}
    />
  );

  const formAddComment = (
    <Comment
      content={
        <Editor
          onChange={handleChange}
          onSubmit={handleSubmit}
          value={commentText}
          idPhoto={idPhoto}
        />
      }
    />
  );

  const commentsBlock = (
    <>
      {formAddComment}
      {currentComments.length > 0 && <CommentList comments={currentComments} />}
    </>
  );

  return (
    <>
      <StyledImage src={src} />
      {commentsBlock}
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

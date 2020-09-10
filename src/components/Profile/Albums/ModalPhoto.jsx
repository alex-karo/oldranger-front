import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { parseISO, format, formatDistanceToNow } from 'date-fns';
import ru from 'date-fns/locale/ru';
import PropTypes from 'prop-types';
import { Comment, List, Tooltip, Popover } from 'antd';
import { Form, SubmitButton, Input } from 'formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { formatDateToLocalTimeZone } from '../../../utils';
import UserAvatar from '../../commons/UserAvatar';

const validationSchema = Yup.object({ text: Yup.string().required('Введите текст комментария') });
const initialValues = { text: '' };

const renderEditorForm = onSubmit => {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      <Form>
        <Form.Item name="text">
          <Input.TextArea name="text" rows={4} />
        </Form.Item>
        <SubmitButton type="primary">Добавить комментарий</SubmitButton>
      </Form>
    </Formik>
  );
};

function ModalPhoto(props) {
  const { src, currentComments, addComment, idPhoto } = props;

  const handleSubmit = (values, { resetForm }) => {
    addComment({ idPhoto, commentText: values.text });
    resetForm();
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
              avatar={
                <Popover placement="right">
                  <UserAvatar src={author.avatar.small} />
                </Popover>
              }
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

  return (
    <>
      <StyledImage src={src} />
      {<Comment content={renderEditorForm(handleSubmit)} />}
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
  currentComments: PropTypes.arrayOf(PropTypes.object),
  src: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
};

ModalPhoto.defaultProps = {
  currentComments: [],
};

export default withRouter(ModalPhoto);

import React, { useContext } from 'react';
import { Button, Form as AntForm, Alert } from 'antd';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TopicReplyEditor from './TopicReplyEditor';
import TopicPhotoList from './TopicPhotoList';
import fileProps from './propTypes/fileProps';
import context from '../Context';

const validationSchema = Yup.object({
  message: Yup.string()
    .min(1, 'Сообщение не может быть пустым')
    .max(500000, 'Слишком длинное сообщение').isRequired,
});

const TopicReplyForm = ({ replyRef, handleSubmitComment, handleAddFile, files, uploading }) => {
  const {
    user: { mute },
  } = useContext(context);
  const muteComments = mute && mute.includes('ON_COMMENTS');
  return muteComments ? (
    <Alert
      message="Комментирование заблокировано"
      description="Вам запрещено оставлять комментарии"
      type="error"
    />
  ) : (
    <Formik
      initialValues={{
        message: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        handleSubmitComment(values.message, resetForm);
      }}
    >
      {({ handleSubmit, handleChange, errors, touched, values }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <AntForm.Item
              hasFeedback={!!touched.message && !!errors.message}
              validateStatus={touched.message && errors.message ? 'error' : 'success'}
              help={touched.message ? errors.message : ''}
            >
              <TopicReplyEditor
                value={values.message}
                onChange={handleChange('message')}
                placeholder="Напишите свое сообщение"
                replyRef={replyRef}
              />
            </AntForm.Item>
            <AntForm.Item>
              <TopicPhotoList
                handleChangePicturesState={handleAddFile}
                fileList={files}
                canUpload
              />
            </AntForm.Item>
            <AntForm.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={(!!touched.messgae && !!errors.message) || muteComments}
                loading={uploading}
              >
                {uploading ? 'Отправка' : 'Отправить'}
              </Button>
            </AntForm.Item>
          </Form>
        );
      }}
    </Formik>
  );
};

TopicReplyForm.propTypes = {
  replyRef: PropTypes.func.isRequired,
  handleSubmitComment: PropTypes.func.isRequired,
  handleAddFile: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(fileProps).isRequired,
  uploading: PropTypes.bool.isRequired,
};

export default TopicReplyForm;

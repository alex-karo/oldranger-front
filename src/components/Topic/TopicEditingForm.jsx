import React from 'react';
import { Button, Form as AntForm, message } from 'antd';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import * as Yup from 'yup';
import TopicReplyEditor from './TopicReplyEditor';
import queries from '../../serverQueries';
import TopicPhotoList from './TopicPhotoList';
import fileProps from './propTypes/fileProps';

const validationSchema = Yup.object({
  message: Yup.string()
    .min(1, 'Сообщение не может быть пустым')
    .max(500000, 'Слишком длинное сообщение'),
});

class TopicEditingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: props.fileList,
    };
  }

  handleAddFile = info => {
    this.setState({ files: info.fileList });
    if (info.file.status !== 'removed') {
      message.success(`Файл ${info.file.name} успешно добавлен`);
    }
  };

  handleSubmitForm = text => {
    const {
      idTopic,
      idUser,
      commentId,
      getTopics,
      page,
      history,
      handleCancel,
      updateComment,
    } = this.props;

    if (!commentId) {
      message.error('Вы не выбрали какой комментарий редактировать!');
      return;
    }

    const { files } = this.state;
    const editingComment = {
      idTopic,
      idUser,
      commentId,
      text,
      photoIdList: [],
    };

    files.forEach((file, index) => {
      if (file.originFileObj) {
        editingComment[`image${index + 1}`] = file;
      } else {
        editingComment.photoIdList.push(file.uid * -1);
      }
    });
    queries
      .updateComment(editingComment)
      .then(comment => {
        history.push(`${history.location.pathname}?page=${page}`);
        if (getTopics) {
          getTopics(page);
        }
        if (updateComment) {
          updateComment(comment);
        }
        message.success('Сообщение сохранено');
        handleCancel();
      })
      .catch(() => {
        message.error('Что-то пошло не так,  сообщение не сохраненно');
      });
  };

  render() {
    const { edetingText, handleCancel, fileList } = this.props;
    const { files } = this.state;
    return (
      <Formik
        initialValues={{
          message: edetingText,
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          this.handleSubmitForm(values.message);
        }}
      >
        {({ handleSubmit, handleChange, errors, touched, values, handleBlur }) => {
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
                  onBlur={handleBlur}
                  name="message"
                  rows={4}
                />
              </AntForm.Item>
              <AntForm.Item>
                <TopicPhotoList
                  fileList={files}
                  handleChangePicturesState={this.handleAddFile}
                  canUpload
                  defaultFileList={fileList}
                />
              </AntForm.Item>
              <AntForm.Item>
                <Button
                  onClick={handleCancel}
                  type="dashed"
                  htmlType="button"
                  style={{ marginRight: '10px' }}
                >
                  Отмена
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!!touched.message && !!errors.message}
                >
                  Сохранить
                </Button>
              </AntForm.Item>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default withRouter(TopicEditingForm);

TopicEditingForm.defaultProps = {
  commentId: null,
  updateComment: undefined,
  getTopics: undefined,
  page: undefined,
};

TopicEditingForm.propTypes = {
  edetingText: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
  fileList: PropTypes.arrayOf(fileProps).isRequired,
  idTopic: PropTypes.number.isRequired,
  idUser: PropTypes.number.isRequired,
  commentId: PropTypes.number,
  getTopics: PropTypes.func,
  page: PropTypes.number,
  updateComment: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }).isRequired,
};

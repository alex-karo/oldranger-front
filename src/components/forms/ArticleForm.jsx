import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Button, Checkbox, Form, Input, Spin } from 'antd';
import { Formik } from 'formik';
import { EditorField, SelectField, FormItemLabel } from './fields';
import useTagsFetching from '../../hooks/useTagsFetching';
import ArticlePhotosUploader from '../AdminPanel/ArticlePhotosUploader';
import ArticleAddPhotosModal from '../AdminPanel/ArticleAddPhotosModal';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Это поле обязательно')
    .min(5, 'Заголовок не может быть меньше 5 символов'),
  text: Yup.string().required('Это поле обязательно'),
  tagsId: Yup.array(Yup.number().required('Это поле обязательно')).min(1, 'Добавьте минимум 1 тэг'),
});

const ArticleForm = ({ initialValues, buttonText, onSubmit, onSubmitSuccess, onSubmitError }) => {
  const [photoList, setPhotoList] = useState([]);
  const [isAddPhotosModalVisible, setIsAddPhotosModalVisible] = useState(false);
  const [checkedImage, setCheckedImage] = useState('');
  const [replyRef, setReplyRef] = useState('');

  const handleImage = image => {
    if (image) {
      setIsAddPhotosModalVisible(true);
    }
    if (image && typeof image === 'object') {
      const quillRef = replyRef.getEditor();
      const range = quillRef.getSelection(true);

      quillRef.insertEmbed(range.index, 'img', {
        alt: 'image',
        src: image.thumbUrl,
      });
      quillRef.setSelection(range.index + 1);
    }
  };

  const editorModules = {
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image'],
      ],
      handlers: { image: handleImage },
    },
  };

  const onSubmitWrapper = useCallback(
    () => async (data, { resetForm, setSubmitting }) => {
      try {
        const res = await onSubmit(data);
        setSubmitting(false);
        resetForm();
        if (onSubmitSuccess) {
          onSubmitSuccess(res);
        }
      } catch (error) {
        setSubmitting(false);
        if (onSubmitError) {
          onSubmitError(error);
        }
      }
    },
    [onSubmit, onSubmitSuccess, onSubmitError]
  );

  const { loading, results: tags, error } = useTagsFetching();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitWrapper()}
    >
      {({ values, handleChange, touched, errors, handleSubmit, submitting, isSubmitting }) => {
        if (isSubmitting) {
          return <Spin />;
        }

        return (
          <Form onSubmit={handleSubmit} labelAlign="left">
            <FormItemLabel name="title" label="Заголовок">
              <Input name="title" value={values.title} onChange={handleChange('title')} />
            </FormItemLabel>
            <FormItemLabel name="tagsId" label="Разделы">
              <SelectField
                loading={loading || error}
                name="tagsId"
                options={tags}
                notFoundContent="Разделов не найдено"
              />
            </FormItemLabel>

            <FormItemLabel wrapperCol={{ span: 24 }} name="text">
              <EditorField
                name="text"
                className="article-editor"
                setReplyRef={setReplyRef}
                modules={editorModules}
              >
                {/* <ArticleContentView /> */}
              </EditorField>
            </FormItemLabel>
            <Form.Item>
              <ArticlePhotosUploader
                setPhotoList={setPhotoList}
                setCheckedImage={setCheckedImage}
                photoList={photoList}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Checkbox name="isDraft" checked={values.isDraft} onChange={handleChange('isDraft')}>
                Черновик
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!!touched.message && !!errors.message}
                loading={submitting}
              >
                {buttonText}
              </Button>
            </Form.Item>
            <ArticleAddPhotosModal
              isVisible={isAddPhotosModalVisible}
              handleImage={handleImage}
              checkedImage={checkedImage}
              setCheckedImage={setCheckedImage}
              setVisible={setIsAddPhotosModalVisible}
              photoList={photoList}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

ArticleForm.defaultProps = {
  buttonText: 'Отправить',
  initialValues: {
    title: '',
    text: '',
    tagsId: [],
    isHideToAnon: true,
    isDraft: true,
  },
  onSubmitSuccess: null,
  onSubmitError: null,
};

ArticleForm.propTypes = {
  buttonText: PropTypes.string,
  initialValues: PropTypes.shape([PropTypes.array]),
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func,
  onSubmitError: PropTypes.func,
};

export default ArticleForm;

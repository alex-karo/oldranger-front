import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Button, Checkbox, Form, Input } from 'antd';
import { Formik } from 'formik';
import { EditorField, FormItemLabel } from './fields';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Это поле обязательно')
    .min(5, 'Заголовок не может быть меньше 5 символов'),
  startMessage: Yup.string()
    .required('Это поле обязательно')
    .max(500000, 'Слишком длинное сообщение'),
});

const editorModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ],
};

const TopicForm = ({ initialValues, onSubmit, onSubmitSuccess, onSubmitError }) => {
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitWrapper()}
    >
      {({ values, handleChange, touched, errors, handleSubmit, submitting }) => {
        return (
          <Form onSubmit={handleSubmit} labelAlign="left">
            <FormItemLabel name="name" label="Заголовок">
              <Input name="name" value={values.name} onChange={handleChange('name')} />
            </FormItemLabel>
            <FormItemLabel wrapperCol={{ span: 24 }} name="startMessage">
              <EditorField name="startMessage" className="article-editor" modules={editorModules} />
            </FormItemLabel>
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
                Отравить
              </Button>
            </Form.Item>
          </Form>
        );
      }}
    </Formik>
  );
};

TopicForm.defaultProps = {
  initialValues: {
    name: '',
    startMessage: '',
    isDraft: true,
  },
  onSubmitSuccess: null,
  onSubmitError: null,
};

TopicForm.propTypes = {
  initialValues: PropTypes.shape([PropTypes.array]),
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func,
  onSubmitError: PropTypes.func,
};

export default TopicForm;

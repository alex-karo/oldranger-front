import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Form, Modal } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik';

const validationSchema = Yup.object({
  text: Yup.string()
    .required('Это поле обязательно')
    .max(20, 'Слишком длинное поле'),
});

const TagsModal = ({ text, onSubmit, visible, onCancel, node }) => {
  const onSubmitWrapper = async (data, { resetForm, setSubmitting }) => {
    try {
      await onSubmit(data);
      setSubmitting(false);
      resetForm();
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={{ text }} validationSchema={validationSchema} onSubmit={onSubmitWrapper}>
      {({ handleSubmit, values }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Modal
              title={text}
              visible={visible}
              onCancel={onCancel}
              okText="Отправить"
              cancelText="Закрыть"
              onOk={() => onSubmit(node, values)}
            >
              <Field name="text" />
              <ErrorMessage name="text" component="div" style={{ color: 'tomato' }} />
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

TagsModal.propTypes = {
  text: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  node: PropTypes.objectOf.isRequired,
};

export default TagsModal;

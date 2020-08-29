import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { Form, Input, Icon, Button, Alert } from 'antd';
import Select from 'react-select';
import serverQueries from '../../serverQueries';
import Context from '../Context';

const SendMailBlock = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const formStyles = { width: '500px' };
const selectRole = [
  { value: 'ROLE_ADMIN', label: 'администратору' },
  { value: 'ROLE_MODERATOR', label: 'модератору' },
  { value: 'ROLE_USER', label: 'новичкам' },
  { value: 'ROLE_PROSPECT', label: 'постояльцам' },
  { value: 'ROLE_OLD_TIMER', label: 'старожилам' },
  { value: 'ROLE_VETERAN', label: 'ветеранам' },
];

const MailingLetters = () => {
  const [sendingStatus, setSendingStatus] = useState('');

  const transformMessage = (values, user) => {
    const dateMessage = new Date();
    const dataUser = {
      emailDraft: {
        id: user.id,
        subject: values.subject,
        message: values.message,
        lastEditDate: dateMessage,
      },
      roles: values.roles.map(rol => rol.value),
    };
    return dataUser;
  };
  const validationSchema = Yup.object().shape({
    subject: Yup.string().required('Обязательное поле'),
    message: Yup.string().required('Обязательное поле'),
  });
  const handleSubmitMessage = (values, user, setSubmitting, resetForm) => {
    setSubmitting(true);
    const dataMessage = transformMessage(values, user);
    serverQueries
      .sendMailToAllUsers(dataMessage)
      .then(() => {
        setSendingStatus('success');
        setSubmitting(false);
        resetForm();
      })
      .catch(err => {
        setSendingStatus('error');
        setSubmitting(false);
        /* eslint no-unused-vars: ["error", { "args": "none" }] */
      });
  };

  return (
    <Context.Consumer>
      {({ user }) => {
        return (
          <SendMailBlock>
            <Formik
              validationSchema={validationSchema}
              initialValues={{ subject: '', message: '', roles: '' }}
              onSubmit={(values, { setSubmitting, resetForm }) =>
                handleSubmitMessage(values, user, setSubmitting, resetForm)
              }
            >
              {({
                values,
                errors,
                touched,
                isSubmitting,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <Form onSubmit={handleSubmit} style={formStyles}>
                  <FormItem touched={touched.subject} errors={errors.subject}>
                    <Input
                      type="subject"
                      id="subject"
                      prefix={<Icon type="mail" />}
                      placeholder="Введите заголовок"
                      value={values.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormItem>
                  <FormItem touched={touched.message} errors={errors.message}>
                    <Input.TextArea
                      autoSize={{ minRows: 8, maxRows: 8 }}
                      type="message"
                      id="message"
                      prefix={<Icon type="mail" />}
                      placeholder="Введите сообщение"
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormItem>
                  <h2 style={{ textAlign: 'center' }}>Выбирите кому отправить сообщения</h2>
                  <Field
                    name="roles"
                    component={({ field }) => (
                      <Select
                        type="roles"
                        id="roles"
                        name="roles"
                        options={selectRole}
                        placeholder="Выберите кому отправить сообщения"
                        value={values.roles}
                        isMulti
                        onChange={option => setFieldValue(field.name, option)}
                      />
                    )}
                  />
                  <Form.Item>
                    <SubmitButtonWrapper>
                      <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                        Отправить
                      </Button>
                    </SubmitButtonWrapper>
                  </Form.Item>
                  {sendingStatus === 'success' && (
                    <Alert type="success" message="Сообщение отправлено" />
                  )}
                  {sendingStatus === 'error' && (
                    <Alert type="error" message="Сообщение не отправлено" />
                  )}
                </Form>
              )}
            </Formik>
          </SendMailBlock>
        );
      }}
    </Context.Consumer>
  );
};

const FormItem = ({ touched, errors, children }) => {
  return (
    <Form.Item
      validateStatus={touched && errors ? 'error' : null}
      help={touched && errors ? errors : null}
    >
      {children}
    </Form.Item>
  );
};

FormItem.propTypes = {
  children: PropTypes.element.isRequired,
  touched: PropTypes.bool,
  errors: PropTypes.string,
};

FormItem.defaultProps = {
  touched: false,
  errors: '',
};

export default MailingLetters;

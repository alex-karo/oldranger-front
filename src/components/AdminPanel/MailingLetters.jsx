import React, { useState } from 'react';
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

const MailingLetters = () => {
  const [sendingStatus, setSendingStatus] = useState('');
  const select = [
    { value: 'ROLE_ADMIN', label: 'администратору' },
    { value: 'ROLE_MODERATOR', label: 'модератору' },
    { value: 'ROLE_USER', label: 'новичкам' },
    { value: 'ROLE_PROSPECT', label: 'постояльцам' },
    { value: 'ROLE_OLD_TIMER', label: 'старожилам' },
    { value: 'ROLE_VETERAN', label: 'ветеранам' },
  ];

  const transformMessage = (values, user) => {
    const dateMessage = new Date();
    const res = {
      emailDraft: {
        id: user.id,
        subject: values.subject,
        message: values.message,
        lastEditDate: dateMessage,
      },
      roles: values.roles.map(rol => rol.value),
    };
    return res;
  };
  const validationSchema = Yup.object().shape({
    subject: Yup.string().required('Обязательное поле'),
    message: Yup.string().required('Обязательное поле'),
  });

  return (
    <Context.Consumer>
      {({ user }) => {
        return (
          <SendMailBlock>
            <Formik
              validationSchema={validationSchema}
              initialValues={{ subject: '', message: '', roles: '' }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
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
                    throw err;
                  });
              }}
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
                  <Form.Item
                    validateStatus={touched.subject && errors.subject ? 'error' : null}
                    help={touched.subject && errors.subject ? errors.subject : null}
                  >
                    <Input
                      type="subject"
                      id="subject"
                      prefix={<Icon type="mail" />}
                      placeholder="Введите заголовок"
                      value={values.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={touched.message && errors.message ? 'error' : null}
                    help={touched.message && errors.message ? errors.message : null}
                  >
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
                  </Form.Item>
                  <h2 style={{ textAlign: 'center' }}>Выбирите кому отправить сообщения</h2>
                  <Field
                    name="roles"
                    component={({ field }) => (
                      <Select
                        type="roles"
                        id="roles"
                        name="roles"
                        options={select}
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

export default MailingLetters;

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Row } from 'antd';
import { Form, Input } from 'formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import queries from '../serverQueries';

import FormItem from './formItems/FormItem';

const Title = styled.h2`
  text-align: center;
`;

const formLayoutSchema = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const validationSchema = Yup.object({
  firstName: Yup.string().required('Это поле обязательно'),
  lastName: Yup.string().required('Это поле обязательно'),
  email: Yup.string()
    .email('Некорректный email адрес')
    .required('Это поле обязательно'),
});

const onSubmit = ({ changeLoadingState }) => async (values, { setStatus, resetForm }) => {
  changeLoadingState(true);
  try {
    await queries.requestRegistration({ ...values });
    resetForm({});
    setStatus('Письмо успешно отправлено администратору');
  } catch (error) {
    setStatus('Ошибка, повторите позже');
  }
  changeLoadingState(false);
};

const FormCommunicationAdmin = () => {
  const [loading, changeLoadingState] = useState(false);
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        about: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit({ changeLoadingState })}
    >
      {({ status }) => (
        <>
          <Title>Связаться с администратором</Title>
          {status && (
            <Row type="flex" justify="center">
              <h3>{status}</h3>
            </Row>
          )}
          <Form {...formLayoutSchema}>
            <FormItem label="Имя" name="firstName">
              <Input name="firstName" />
            </FormItem>
            <FormItem label="Фамилия" name="lastName">
              <Input name="lastName" />
            </FormItem>
            <FormItem label="Почта" name="email">
              <Input name="email" />
            </FormItem>
            <FormItem label="О себе" name="about">
              <Input.TextArea name="about" rows={4} />
            </FormItem>

            <Row type="flex" justify="center">
              <Button type="primary" htmlType="submit" loading={loading}>
                Отправить
              </Button>
            </Row>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default FormCommunicationAdmin;

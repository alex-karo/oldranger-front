import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { Button, Row, Divider } from 'antd';
import { Form, Input } from 'formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import queries from '../serverQueries';

import FormItem from './formItems/FormItem';

const WrapperForm = styled.div``;

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
  nickName: Yup.string().required('Это поле обязательно'),
  firstName: Yup.string().required('Это поле обязательно'),
  lastName: Yup.string().required('Это поле обязательно'),
  password: Yup.string()
    .required('Это поле обязательно')
    .min(8, 'Минимальная длина пароля - 8 символов')
    .max(40, 'Максимальная длина пароля - 40 символов')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)./, 'Пароль должен содержать символы A-Z, a-z, 0-9'),
  repeatPassword: Yup.string()
    .required('Это поле обязательно')
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
  email: Yup.string()
    .email('Некорректный email адрес')
    .required('Это поле обязательно'),
});

const Registration = () => {
  const [loading, changeLoadingState] = useState(false);
  const query = new URLSearchParams(useLocation().search);
  const key = query.get('key');

  const register = token => async (values, { setStatus }) => {
    changeLoadingState(true);
    setStatus('');

    try {
      const res = await queries.registrationUser({ key: token, ...values });
      if (res === 1) {
        queries.createNewAlbum(values.firstName);
        setStatus('Письмо с подтверждением отправлено на ваш email');
      } else {
        setStatus('Некорректный token регистрации');
      }
    } finally {
      changeLoadingState(false);
    }
  };
  return (
    <Formik
      initialValues={{
        nickName: '',
        firstName: '',
        lastName: '',
        password: '',
        repeatPassword: '',
        email: '',
      }}
      validationSchema={validationSchema}
      onSubmit={register(key)}
    >
      {({ status }) => (
        <>
          <WrapperForm>
            <Title>Регистрация</Title>
            {status && (
              <Row type="flex" justify="center">
                <h3>{status}</h3>
              </Row>
            )}
            <Form {...formLayoutSchema}>
              <FormItem label="Логин" name="nickName">
                <Input name="nickName" />
              </FormItem>
              <FormItem label="Имя" name="firstName">
                <Input name="firstName" />
              </FormItem>
              <FormItem label="Фамилия" name="lastName">
                <Input name="lastName" />
              </FormItem>
              <Divider />
              <FormItem label="Пароль" name="password">
                <Input.Password name="password" />
              </FormItem>
              <FormItem label="Повторите пароль" name="repeatPassword">
                <Input.Password name="repeatPassword" />
              </FormItem>
              <Divider />
              <FormItem label="Почта" name="email">
                <Input name="email" />
              </FormItem>

              <Row type="flex" justify="center">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Зарегистрироваться
                </Button>
              </Row>
            </Form>
          </WrapperForm>
        </>
      )}
    </Formik>
  );
};

export default Registration;

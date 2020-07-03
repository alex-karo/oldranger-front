import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Statistic, Modal } from 'antd';
import { Form, Input } from 'formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import queries from '../serverQueries';
import Context from './Context';
import FormItem from './formItems/FormItem';

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
  username: Yup.string().required('Это поле обязательно'),
  password: Yup.string().required('Это поле обязательно'),
});

const showBanStatus = (unlockTime = Date.now()) => {
  // 31557600000 - год
  const perpetualBan = unlockTime - Date.now() > 31557600000;
  Modal.error({
    title: 'Вы забаннены на этом форуме',
    content: perpetualBan ? (
      'НАВСЕГДА'
    ) : (
      <Statistic.Countdown
        valueStyle={{ fontSize: '20px' }}
        title="До окончания бана"
        value={unlockTime}
        format="D д H ч m мин s сек"
      />
    ),
  });
};

const login = ({ changeLoginState, changeUserState, changeLoadingState }, connectFunc) => async (
  values,
  { setStatus }
) => {
  changeLoadingState(true);
  const formData = new FormData();
  formData.append('username', values.username);
  formData.append('password', values.password);
  try {
    await queries.logIn(formData);
    const userData = await queries.getProfileData();
    connectFunc();
    localStorage.setItem('user', JSON.stringify(userData));

    setStatus('');
    changeLoginState();
    changeUserState(userData);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      setStatus('Проверьте правильность ввода логина и пароля');
    }
    if (error.response && error.response.status === 403) {
      showBanStatus(error.response.data.unlockTime);
    }
    changeLoadingState(false);
  }
};

const Login = ({ connect }) => {
  const [loading, changeLoadingState] = useState(false);
  const { changeLoginState, changeUserState } = useContext(Context);
  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={login({ changeLoginState, changeUserState, changeLoadingState }, connect)}
      >
        {({ status }) => (
          <>
            {status && (
              <Row type="flex" justify="center">
                <h3>{status}</h3>
              </Row>
            )}
            <Form {...formLayoutSchema}>
              <FormItem label="Логин" name="username">
                <Input name="username" />
              </FormItem>
              <FormItem label="Пароль" name="password">
                <Input.Password name="password" />
              </FormItem>

              <Row type="flex" justify="center">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Войти
                </Button>
              </Row>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

Login.propTypes = {
  connect: PropTypes.func.isRequired,
};

export default Login;

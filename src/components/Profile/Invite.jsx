import React from 'react';
import { Row, Button, Divider, Input, Typography } from 'antd';
import { Form, Input as FormikInput } from 'formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import queries from '../../serverQueries';
import FormItem from '../formItems/FormItem';
// import { BASE_URL } from '../../constants';

const { Title } = Typography;

const StyledWrapper = styled.div`
  margin-bottom: 20px;
  .ant-input {
    max-width: 400px;
  }
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
  mail: Yup.string()
    .email('Некорректный email адрес')
    .required('Это поле обязательно'),
});

class Invite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      token: '',
    };
  }

  async componentDidMount() {
    const token = await queries.getInviteCode();
    this.setState({ token });
  }

  submitForm = async (values, { setStatus }) => {
    this.setState({ loading: true });
    const status = await queries.sendInviteCode(values);

    switch (status) {
      case 1:
        setStatus('Приглашение успешно отправлено.');
        break;

      default:
        setStatus('Извините, но сервис отправки приглашений временно не работает.');
        break;
    }

    this.setState({ loading: false });
  };

  render() {
    const { loading, token } = this.state;
    return (
      <>
        <StyledWrapper>
          <Row type="flex" justify="center">
            <h4>Скопируйте ссылку и отправьте другу</h4>
          </Row>
          <Row type="flex" justify="center">
            <Input value={`oldranger.club/invite?key=${token}`} />
          </Row>
        </StyledWrapper>

        <Divider>ИЛИ</Divider>

        <Formik
          initialValues={{
            mail: '',
          }}
          validationSchema={validationSchema}
          onSubmit={this.submitForm}
        >
          {({ handleSubmit, status }) => (
            <Form onSubmit={handleSubmit} {...formLayoutSchema}>
              <Row type="flex" justify="center">
                <h4>Отправьте приглашение на почту</h4>
              </Row>

              {status && (
                <Row type="flex" justify="center">
                  <Title level={4} type="danger">
                    {status}
                  </Title>
                </Row>
              )}

              <FormItem label="Email" name="mail">
                <FormikInput name="mail" />
              </FormItem>

              <Row type="flex" justify="center">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Отправить
                </Button>
              </Row>
            </Form>
          )}
        </Formik>
      </>
    );
  }
}

export default Invite;

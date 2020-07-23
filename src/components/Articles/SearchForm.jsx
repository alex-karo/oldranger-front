import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Button, Form as AntForm, Input } from 'antd';
import SimpleInput from '../formItems/SimpleInput';
import { StyledForm, ButtonGroup } from './styled';
import UserContext from '../Context/index';
import { userRoles } from '../../constants/index';

const InputGroup = Input.Group;

const validationSchema = Yup.object({
  searchRequest: Yup.string()
    .min(3, 'Введите не меннее 3-х символов')
    .matches(/[\S]+(\s[\S]+)*/, 'Поле поиска должно быть заполнено')
    .required('Поле поиска должно быть заполнено'),
});

const SearchForm = ({ history }) => {
  const {
    user: { role },
  } = useContext(UserContext);
  return (
    <Formik
      initialValues={{
        searchRequest: '',
      }}
      validationSchema={validationSchema}
      onSubmit={({ searchRequest }) => history.push(`/searchArticles/${searchRequest}`)}
    >
      {({ handleSubmit, errors, touched, values, handleChange, handleBlur }) => {
        return (
          <StyledForm onSubmit={handleSubmit}>
            <AntForm.Item
              hasFeedback={!!touched.searchRequest && !!errors.searchRequest}
              validateStatus={touched.searchRequest && errors.searchRequest ? 'error' : 'success'}
              help={touched.searchRequest ? errors.searchRequest : ''}
            >
              <ButtonGroup>
                {role === userRoles.admin ? (
                  <Button>
                    <Link to="/admin-panel/article-create">Создать статью</Link>
                  </Button>
                ) : null}

                <InputGroup compact>
                  <SimpleInput
                    placeholder="поиск по статьям"
                    name="searchRequest"
                    type="text"
                    value={values.searchRequest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </InputGroup>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  disabled={!!touched.searchRequest && !!errors.searchRequest}
                >
                  Искать
                </Button>
              </ButtonGroup>
            </AntForm.Item>
          </StyledForm>
        );
      }}
    </Formik>
  );
};

SearchForm.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withRouter(SearchForm);

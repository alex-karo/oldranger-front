import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Formik, Field as FormikField } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Button, Form as AntForm, Input, Select } from 'antd';
import Context from '../Context';
import SimpleInput from '../formItems/SimpleInput';
import { StyledForm, StyledSelect, ButtonGroup } from './styled';

const InputGroup = Input.Group;
const { Option } = Select;

const validationSchema = Yup.object({
  searchRequest: Yup.string().min(3, 'Введите не меннее 3-х символов'),
});

const SearchForm = ({ history }) => {
  const { isLogin } = useContext(Context);
  return (
    <Formik
      initialValues={{
        searchRequest: '',
        searchBy: 'searchTopics',
      }}
      validationSchema={validationSchema}
      onSubmit={({ searchBy, searchRequest }) => history.push(`/${searchBy}/${searchRequest}`)}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, setFieldTouched }) => {
        return (
          <StyledForm onSubmit={handleSubmit}>
            <AntForm.Item
              hasFeedback={!!touched.searchRequest && !!errors.searchRequest}
              validateStatus={touched.searchRequest && errors.searchRequest ? 'error' : 'success'}
              help={touched.searchRequest ? errors.searchRequest : ''}
            >
              <ButtonGroup>
                {isLogin && (
                  <Button>
                    <Link to="/topic/add">Создать тему</Link>
                  </Button>
                )}
                <InputGroup compact>
                  <SimpleInput placeholder="Поиск по Форуму" name="searchRequest" type="text" />
                  <FormikField name="searchBy">
                    {({ field }) => (
                      <StyledSelect
                        {...field}
                        onChange={value => setFieldValue('searchBy', value)}
                        onBlur={() => setFieldTouched('searchBy', true)}
                        value={values.searchBy}
                      >
                        <Option key={1} value="searchTopics">
                          По темам
                        </Option>
                        <Option key={2} value="searchComments">
                          По сообщениям
                        </Option>
                      </StyledSelect>
                    )}
                  </FormikField>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon="search"
                    disabled={!!touched.searchRequest && !!errors.searchRequest}
                  >
                    Искать
                  </Button>
                </InputGroup>
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

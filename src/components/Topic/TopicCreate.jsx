/* eslint react/prop-types: 0 */
/* eslint no-restricted-syntax: 0 */
/* eslint no-unused-vars: 0 */
import React from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Button, Input, Select, Spin, Row } from 'antd';
import { withFormik, Field, Form } from 'formik';
import { Link, withRouter } from 'react-router-dom';
import queries from '../../serverQueries';
import TopicAddFileModal from './TopicAddFileModal';

const StyledForm = styled(Form)`
  margin: 0 auto;
  width: 500px;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 10px;
`;

const StyledField = styled.div`
  margin-bottom: 10px;
`;

const StyledError = styled.span`
  color: red;
`;

const PrimaryButton = styled(Button)`
  margin: 10px 10px 0 0;
`;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Минимальная длина 3 символа')
    .required('Заголовок обязателен для заполнения'),
  startMessage: Yup.string()
    .min(4, 'Минимальная длина 4 символа')
    .required('Краткое описание обязательно для заполнения'),
});

class TopicCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
      subsection: '',
      isModal: false,
      imagesToUpload: [],
      photoAlbumIds: [],
      fileList: [],
    };
  }

  componentDidMount = async () => {
    const response = await queries.getAllSections();
    const sections = response.map(item => item.section.name);
    const data = {};
    response.forEach(item => {
      data[item.section.name] = item.subsections;
    });

    const subsectionsData = {};
    Object.values(data).forEach(item => {
      item.forEach(subsection => {
        subsectionsData[subsection.name] = subsection;
      });
    });
    this.sections = sections;
    this.data = data;
    this.subsectionsData = subsectionsData;
    this.setState({
      children: data[sections[0]],
      subsection: data[sections[0]][0].name,
    });
  };

  handleSectionChange = value => {
    this.setState({
      children: this.data[value],
      subsection: this.data[value][0].name,
    });
  };

  handleSubsectionChange = value => {
    this.setState({
      subsection: value,
    });
  };

  toggleImageToUpload = (id, photoAlbumId) => () => {
    const { imagesToUpload } = this.state;
    if (imagesToUpload.indexOf(id) !== -1) {
      imagesToUpload.splice(imagesToUpload.indexOf(id), 1);
      this.setState({
        imagesToUpload: [...imagesToUpload],
      });
    } else {
      this.setState(state => ({
        imagesToUpload: [...state.imagesToUpload, id],
      }));
    }
    this.setState(state => ({
      photoAlbumIds: !state.photoAlbumIds.includes(photoAlbumId)
        ? [...state.photoAlbumIds, photoAlbumId]
        : state.photoAlbumIds,
    }));
  };

  setFileList = formData => {
    let count = 0;
    for (const field of formData) {
      count += 1;
    }
    this.setState({ fileList: formData, count, isModal: false });
  };

  handleSubmit = () => {
    const { values, setValues } = this.props;
    const { subsection, fileList, imagesToUpload, photoAlbumIds } = this.state;
    setValues({
      ...values,
      subsection,
      subsectionsData: this.subsectionsData,
      fileList,
      imagesToUpload,
      photoAlbumIds,
    });
  };

  handleToggleModal = bool => () => {
    this.setState(state => ({
      isModal: !state.isModal,
      imagesToUpload: bool ? state.imagesToUpload : [],
    }));
  };

  render() {
    const { children, subsection, isModal, count, imagesToUpload } = this.state;
    const { errors, touched, isSubmitting } = this.props;
    return (
      <>
        {isModal ? (
          <TopicAddFileModal
            handleCloseModal={this.handleToggleModal}
            setFileList={this.setFileList}
            imagesToUpload={imagesToUpload}
            toggleImageToUpload={this.toggleImageToUpload}
          />
        ) : null}

        <StyledForm>
          {children.length !== 0 ? (
            <>
              <StyledField>
                <Field name="name">
                  {({ field }) => <Input {...field} placeholder="Заголовок" type="text" />}
                </Field>
                {touched.name && errors.name && (
                  <StyledError className="error">{errors.name}</StyledError>
                )}
              </StyledField>
              <StyledField>
                <Field name="startMessage">
                  {({ field }) => (
                    <Input.TextArea {...field} rows="2" placeholder="Сообщение" type="text" />
                  )}
                </Field>
                {touched.startMessage && errors.startMessage && (
                  <StyledError className="error">{errors.startMessage}</StyledError>
                )}
              </StyledField>
              <StyledField>
                {this.data && (
                  <>
                    <Select defaultValue={this.sections[0]} onChange={this.handleSectionChange}>
                      {this.sections.map(item => (
                        <Select.Option key={item}>{item}</Select.Option>
                      ))}
                    </Select>
                    <Select value={subsection} onChange={this.handleSubsectionChange}>
                      {children.map(subs => (
                        <Select.Option key={subs.name}>{subs.name}</Select.Option>
                      ))}
                    </Select>
                  </>
                )}
              </StyledField>
              <Row type="flex" justify="center">
                <Button
                  type={count > 0 ? 'dashed' : 'default'}
                  onClick={this.handleToggleModal(true)}
                >
                  {count + imagesToUpload.length > 0
                    ? `Выбрано ${count + imagesToUpload.length} фото`
                    : 'Добавить фото'}
                </Button>
              </Row>
              <Row type="flex" justify="center">
                <PrimaryButton
                  htmlType="submit"
                  type="primary"
                  disabled={isSubmitting}
                  onClick={this.handleSubmit}
                >
                  Создать
                </PrimaryButton>
                <PrimaryButton className="home-button">
                  <Link to="/">На главную</Link>
                </PrimaryButton>
              </Row>
            </>
          ) : (
            <Spin />
          )}
        </StyledForm>
      </>
    );
  }
}

const formikTopicCreate = withFormik({
  mapPropsToValues({ name, startMessage }) {
    return {
      name: name || '',
      startMessage: startMessage || '',
    };
  },
  validationSchema,
  handleSubmit: async (values, { setSubmitting, resetForm, props }) => {
    const { history } = props;
    const {
      name,
      startMessage,
      subsection,
      subsectionsData,
      fileList,
      imagesToUpload,
      photoAlbumIds,
    } = values;
    const formData = new FormData();
    formData.append('checkedImagesId', imagesToUpload);
    formData.append('name', name);
    formData.append('startMessage', startMessage);
    formData.append('subsection', subsectionsData[subsection].id);
    fileList.forEach(file => {
      formData.append('photos', file);
    });
    const response = await queries.createNewTopic(formData);
    if (response.status === 200) {
      setSubmitting(false);
      history.push({
        pathname: `/topic/${response.data.id}`,
        state: { imagesToUpload, photoAlbumIds },
      });
      resetForm();
    }
  },
})(TopicCreate);

export default withRouter(formikTopicCreate);

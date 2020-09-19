import { Button, Icon, message, Row, Upload } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import queries from '../../serverQueries';

const UploadButton = styled(Button)`
  @media (max-width: 479px) {
    padding: 5px;
    height: 100%;
  }
`;

const StyledSpan = styled.span`
  @media (max-width: 479px) {
    display: block !important;
  }
`;
class UploadPhoto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
    };
  }

  handleUpload = async () => {
    const { fileList } = this.state;
    const { albumId, loadPhotos } = this.props;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('photos', file);
    });
    this.setState({
      uploading: true,
    });

    try {
      await queries.addPhotosInAlbum(albumId, formData);
      this.setState({
        fileList: [],
        uploading: false,
      });
      message.success('успешная загрузка');
      loadPhotos();
    } catch (error) {
      this.setState({
        uploading: true,
      });
      message.error('ошибка при загрузке');
    }
  };

  render() {
    const { fileList, uploading } = this.state;
    const uploadProps = {
      accept: '.jpg, .jpeg, .png',
      multiple: true,
      onRemove: file => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        this.setState({
          fileList: newFileList,
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    return (
      <>
        <Row type="flex" justify="center">
          <Upload {...uploadProps} disabled={uploading}>
            <UploadButton>
              <Icon type="upload" />
              <StyledSpan>Перетащите сюда или выберите фотографии</StyledSpan>
            </UploadButton>
          </Upload>
        </Row>
        <Row type="flex" justify="center">
          <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ margin: 16 }}
          >
            {uploading ? 'Загружаем' : 'Добавить Фотографии в альбом'}
          </Button>
        </Row>
      </>
    );
  }
}

UploadPhoto.propTypes = {
  loadPhotos: PropTypes.func.isRequired,
  albumId: PropTypes.number.isRequired,
};

export default UploadPhoto;

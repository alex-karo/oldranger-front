import React, { useState } from 'react';
import { Upload, Icon, Modal } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const ImagesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .clicked-image {
    border: 2px solid #33e842;
    transform: scale(2, 0.5)
    overflow: hidden;
  }
  
`;

export const StyledImage = styled.img`
  max-width: 150px;
  max-height: 150px;
  margin: 0 5px 5px 0;
`;

const ArticlePhotosUploader = ({
  getFormData,
  setPhotoList,
  isInModal,
  photoList,
  setCheckedImage,
}) => {
  const formData = new FormData();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [pickedImageUid, setPickedImageUid] = useState('');

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = file => {
    setPreviewImage(file.thumbUrl);
    setPreviewVisible(true);
  };
  /* eslint-disable-next-line no-shadow */
  const handleUpload = ({ fileList }) => {
    fileList.forEach(file => formData.append('file', file.originFileObj)); // добавить отображение
    setPhotoList(fileList);
    getFormData(formData);
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const clickHandler = uid => {
    const eventHandler = () => {
      setPickedImageUid(uid);
      const image = photoList.filter(photo => photo.uid === uid)[0];
      setCheckedImage(image);
    };
    return eventHandler;
  };

  if (isInModal) {
    return (
      <ImagesWrapper>
        {photoList.map(photo => {
          if (photo.uid === pickedImageUid) {
            return (
              <StyledImage
                className="clicked-image"
                onClick={clickHandler(photo.uid)}
                key={photo.uid}
                src={photo.thumbUrl}
              />
            );
          }
          return (
            <StyledImage onClick={clickHandler(photo.uid)} key={photo.uid} src={photo.thumbUrl} />
          );
        })}
      </ImagesWrapper>
    );
  }

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={photoList}
        onPreview={handlePreview}
        onChange={handleUpload}
        onRemove={() => {
          setCheckedImage('');
        }}
        beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
      >
        {uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

ArticlePhotosUploader.propTypes = {
  getFormData: PropTypes.func.isRequired,
  setPhotoList: PropTypes.func.isRequired,
  isInModal: PropTypes.bool.isRequired,
  photoList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setCheckedImage: PropTypes.func.isRequired,
};

export default ArticlePhotosUploader;

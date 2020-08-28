import React, { useState } from 'react';
import { Upload, Icon, Modal } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import queries from '../../serverQueries/index';

export const ImagesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .clicked-image {
    border: 2px solid #33e842;
    transform: scale(1.3, 1.3);
    overflow: hidden;
  }
`;

export const StyledImage = styled.img`
  max-width: 150px;
  margin: 0 5px 5px 0;
`;

const ArticlePhotosUploader = ({ setPhotoList, isInModal, photoList, setCheckedImage }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [pickedImageUid, setPickedImageUid] = useState('');

  const handleCancel = () => setIsPreviewVisible(false);

  const handlePreview = file => {
    setPreviewImage(file.thumbUrl);
    setIsPreviewVisible(true);
  };

  const handleRemove = file => {
    const newPhotoList = photoList.filter(photo => photo.uid !== file.uid);
    setPhotoList(newPhotoList);
    setCheckedImage('');
  };

  const handleImageSend = ({ onProgress, onSuccess, onError, file }) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: event => {
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };

    queries
      .sendPhotos(formData, config)
      .then(res => {
        onSuccess(
          setPhotoList([
            ...photoList,
            {
              uid: file.uid,
              name: file.name,
              thumbUrl: `http://oldranger.club:8888/img/chat/${res.originalImg}`,
              status: 'done',
            },
          ])
        );
      })
      .catch(err => {
        queries.handleError(err);
        const error = new Error('Сетевая ошибка');
        onError(error);
      });
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const handleClick = uid => {
    const handleImagePickEvent = () => {
      setPickedImageUid(uid);
      const image = photoList.filter(photo => photo.uid === uid)[0];
      setCheckedImage(image);
    };
    return handleImagePickEvent;
  };

  if (isInModal) {
    return (
      <ImagesWrapper>
        {photoList.map(photo => {
          if (photo.uid === pickedImageUid) {
            return (
              <StyledImage
                className="clicked-image"
                onClick={handleClick(photo.uid)}
                key={photo.uid}
                src={photo.thumbUrl}
              />
            );
          }
          return (
            <StyledImage onClick={handleClick(photo.uid)} key={photo.uid} src={photo.thumbUrl} />
          );
        })}
      </ImagesWrapper>
    );
  }

  return (
    <div>
      <Upload
        listType="picture-card"
        defaultFileList={photoList}
        onPreview={handlePreview}
        customRequest={handleImageSend}
        onRemove={handleRemove}
      >
        {uploadButton}
      </Upload>
      <Modal visible={isPreviewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

ArticlePhotosUploader.propTypes = {
  setPhotoList: PropTypes.func.isRequired,
  isInModal: PropTypes.bool.isRequired,
  photoList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setCheckedImage: PropTypes.func.isRequired,
};

export default ArticlePhotosUploader;

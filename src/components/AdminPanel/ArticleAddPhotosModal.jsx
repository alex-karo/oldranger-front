import React from 'react';
import { Modal, Empty } from 'antd';
import PropTypes from 'prop-types';
import ArticlePhotosUploader from './ArticlePhotosUploader';

const ArticleAddPhotosModal = ({
  isVisible,
  setVisible,
  photoList,
  checkedImage,
  setCheckedImage,
  handleImage,
}) => {
  const handleOk = () => {
    if (checkedImage) {
      handleImage(checkedImage);
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal title="Выберите фото" visible={isVisible} onCancel={handleCancel} onOk={handleOk}>
      {photoList.length === 0 ? (
        <Empty description="Нет изображений" />
      ) : (
        <ArticlePhotosUploader isInModal setCheckedImage={setCheckedImage} photoList={photoList} />
      )}
    </Modal>
  );
};

ArticleAddPhotosModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  photoList: PropTypes.arrayOf(PropTypes.object).isRequired,
  checkedImage: PropTypes.shape.isRequired,
  setCheckedImage: PropTypes.string.isRequired,
  handleImage: PropTypes.func.isRequired,
};

export default ArticleAddPhotosModal;

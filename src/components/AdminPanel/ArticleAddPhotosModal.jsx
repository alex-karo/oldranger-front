import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import ArticlePhotosUploader from './ArticlePhotosUploader';

const ArticleAddPhotosModal = ({
  isVisible,
  setVisible,
  photoList,
  checkedImage,
  setCheckedImage,
  imageHandler,
}) => {
  const handleOk = () => {
    if (checkedImage) {
      imageHandler(checkedImage.originFileObj);
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal title="Выберите фото" visible={isVisible} onCancel={handleCancel} onOk={handleOk}>
      <ArticlePhotosUploader isInModal setCheckedImage={setCheckedImage} photoList={photoList} />
    </Modal>
  );
};

ArticleAddPhotosModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  photoList: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  checkedImage: PropTypes.object.isRequired,
  setCheckedImage: PropTypes.string.isRequired,
  imageHandler: PropTypes.func.isRequired,
};

export default ArticleAddPhotosModal;

import React, { useState } from 'react';
import { Upload, Icon, Modal } from 'antd';
import PropTypes from 'prop-types';

const ArticlePhotosUploader = ({ getFormData }) => {
  const formData = new FormData();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = file => {
    setPreviewImage(file.thumbUrl);
    setPreviewVisible(true);
  };
  /* eslint-disable-next-line no-shadow */
  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
    fileList.forEach(file => formData.append('photos', file.originFileObj)); // добавить отображение
    getFormData(formData);
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleUpload}
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
};

export default ArticlePhotosUploader;

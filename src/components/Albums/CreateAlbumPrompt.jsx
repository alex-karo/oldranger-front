import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';
import PropTypes from 'prop-types';

const CreateAlbumPrompt = ({ visible, onCreate, onCancel }) => {
  const [albumName, setAlbumName] = useState('');
  const chandeHandler = evt => {
    setAlbumName(evt.target.value);
  };
  return (
    <Modal
      visible={visible}
      title="Новый альбом"
      okText="Создать"
      cancelText="Отмена"
      onCancel={onCancel}
      onOk={() => {
        if (albumName === '') {
          message.error('Необходимо указать название альбома');
          return;
        }
        onCreate(albumName);
        setAlbumName('');
        onCancel();
        message.success('Альбом успешно создан!');
      }}
    >
      <p>Введите название альбома:</p>
      <Input placeholder="Название альбома" value={albumName} onChange={chandeHandler} />
    </Modal>
  );
};

CreateAlbumPrompt.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateAlbumPrompt;

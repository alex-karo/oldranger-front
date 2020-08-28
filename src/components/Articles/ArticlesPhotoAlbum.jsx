import React, { useState, useEffect } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { Button, Icon } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { BASE_URL } from '../../constants/index';
import queries from '../../serverQueries/index';

const CloseModalButton = styled(Button)`
  position: absolute;
  top: 20px;
  padding: 5px;
  right: 20px;
  width: 44px;
  opacity: 0.7;
  z-index: 1;
`;

export const ImageWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 239px;
  margin: 3px;
`;

export const StyledImage = styled.img`
  object-fit: cover;
  object-position: top center;
  width: 239px;
  height: 150px;
  cursor: pointer;
`;

const AlbumWrapper = styled.div`
  display: flex;
  flex-direction: columns;
  flex-wrap: wrap;
  margin-bottom: 50px;
  margin-top: 30px;

  @media (max-width: 1000px) {
    justify-content: center;
  }
`;

const AlbumModalHeader = ({ isModal, modalProps: { onClose } }) =>
  isModal ? (
    <div>
      <CloseModalButton onClick={onClose} title="close">
        <Icon type="close" />
      </CloseModalButton>
    </div>
  ) : null;

const ArticlePhotoAlbum = ({ photoAlbumId }) => {
  const [photos, setPhotos] = useState([]);
  const [photoTempUrl] = useState(`${BASE_URL}api/securedPhoto/photoFromAlbum/`);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    queries.getPhotosFromAlbum(photoAlbumId).then(res => setPhotos(res));
  }, [photoAlbumId]);

  const toggleLightbox = selectIndex => {
    setIsLightboxOpen(!isLightboxOpen);
    setSelectedIndex(selectIndex);
  };

  const images = photos.reduce((acc, photo) => {
    return [...acc, { src: `${photoTempUrl}${photo.photoID}?type=original` }];
  }, []);

  return (
    <AlbumWrapper>
      <>
        {photos.map((photo, index) => (
          <ImageWrapper onClick={() => toggleLightbox(index)} key={photo.photoID}>
            <StyledImage
              title={photo.title}
              alt="userPhoto"
              src={`${photoTempUrl}${photo.photoID}?type=original`}
            />
          </ImageWrapper>
        ))}
        <ModalGateway>
          {isLightboxOpen ? (
            <Modal onClose={toggleLightbox}>
              <Carousel
                views={images}
                currentIndex={selectedIndex}
                components={{ Header: AlbumModalHeader }}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </>
    </AlbumWrapper>
  );
};

ArticlePhotoAlbum.propTypes = {
  photoAlbumId: PropTypes.number.isRequired,
};

AlbumModalHeader.propTypes = {
  isModal: PropTypes.bool.isRequired,
  modalProps: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }).isRequired,
};

export default ArticlePhotoAlbum;

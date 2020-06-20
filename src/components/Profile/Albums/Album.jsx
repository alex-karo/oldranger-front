import React from 'react';
import { Row, Button, Icon, message } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { Link, withRouter } from 'react-router-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import queries from '../../../serverQueries';
import UploadPhoto from './UploadPhoto';
import { BASE_URL } from '../../../constants';

const CloseModalButton = styled(Button)`
position:absolute;
top:20px;
padding:5px
right:20px;
width:44px;
opacity: 0.7;
z-index: 1;
`;

const DeletePhotoModalButton = styled(Button)`
position:absolute;
top:20px;
right:64px;
padding:5px
width:44px;
opacity: 0.7;
z-index: 1;
`;

const DeletePhotoButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  display: none;
  padding: 2px 5px;
  opacity: 0.8;
`;

export const ImageWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 239px;
  margin: 3px;
  &:hover ${DeletePhotoButton} {
    display: block;
  }
`;
const AlbumNavigation = styled.div`
  margin-left: 5px;
`;
export const StyledImage = styled.img`
  object-fit: cover;
  object-position: top center;
  width: 239px;
  height: 150px;
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

const StyledRow = styled(Row)`
  margin-bottom: 50px;
  margin-top: 30px;
`;

class Album extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoTempUlr: `${BASE_URL}api/securedPhoto/photoFromAlbum/`,
      photos: [],
      selectedIndex: 0,
      lightboxIsOpen: false,
    };
  }

  componentDidMount() {
    this.loadPhotos();
  }

  toggleLightbox = selectedIndex => {
    this.setState(state => ({
      lightboxIsOpen: !state.lightboxIsOpen,
      selectedIndex,
    }));
  };

  loadPhotos = async () => {
    const {
      location: { state },
    } = this.props;

    const albumId = state.photoAlbumId;
    try {
      const photos = await queries.getPhotosFromAlbum(albumId);
      this.setState({ photos });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error.response);
      message.error('что-то пошло не так');
    }
  };

  deletePhoto = id => async event => {
    event.stopPropagation();
    const { photos } = this.state;
    try {
      await queries.deletePhotoFromAlbum(id);
      const newPhotos = photos.reduce((acc, item) => {
        if (item.photoID !== id) {
          acc.push(item);
        }
        return [...acc];
      }, []);
      this.setState({ photos: newPhotos });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error.response);
      message.error('что-то пошло не так');
    }
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { photos } = this.state;
    this.setState({
      photos: arrayMove(photos, oldIndex, newIndex),
    });
  };

  render() {
    const { photos, lightboxIsOpen, selectedIndex, photoTempUlr } = this.state;
    const {
      location: {
        state: { photoAlbumId, title },
      },
    } = this.props;
    const images = photos.reduce((acc, photo) => {
      return [...acc, { src: `${photoTempUlr}${photo.photoID}?type=original` }];
    }, []);

    const CustomHeader = ({ currentIndex, isModal, modalProps: { onClose } }) =>
      isModal ? (
        <div>
          <CloseModalButton onClick={onClose} title="close">
            <Icon type="close" />
          </CloseModalButton>
          <DeletePhotoModalButton
            title="delete"
            onClick={event => {
              this.deletePhoto(photos[currentIndex].photoID)(event);
              onClose();
            }}
          >
            <Icon type="delete" title="delete" />
          </DeletePhotoModalButton>
        </div>
      ) : null;

    if (window.matchMedia('(max-width: 479px)').matches) {
      return (
        <>
          <AlbumNavigation>
            <Link to="/profile/albums">Альбомы</Link>
            <span>{` > ${title}`}</span>
          </AlbumNavigation>
          <AlbumWrapper>
            {photos.length > 0 ? (
              <>
                {photos.map((photo, index) => (
                  <ImageWrapper onClick={() => this.toggleLightbox(index)} key={photo.photoID}>
                    <StyledImage
                      title={photo.title}
                      alt="userPhoto"
                      src={`${photoTempUlr}${photo.photoID}?type=original`}
                    />
                    <DeletePhotoButton
                      type="default"
                      title="Удалить Фотографию"
                      onClick={this.deletePhoto(photo.photoID)}
                    >
                      <Icon type="delete" style={{ color: 'red' }} />
                    </DeletePhotoButton>
                  </ImageWrapper>
                ))}
                <ModalGateway>
                  {lightboxIsOpen ? (
                    <Modal onClose={this.toggleLightbox}>
                      <Carousel
                        views={images}
                        currentIndex={selectedIndex}
                        components={{ Header: CustomHeader }}
                      />
                    </Modal>
                  ) : null}
                </ModalGateway>
              </>
            ) : (
              <StyledRow type="flex" justify="center">
                <h4>Альбом пуст</h4>
              </StyledRow>
            )}
          </AlbumWrapper>
          <UploadPhoto albumId={photoAlbumId} loadPhotos={this.loadPhotos} />
        </>
      );
    }

    const SortableItem = SortableElement(({ value, photoNum }) => (
      <ImageWrapper onClick={() => this.toggleLightbox(photoNum)}>
        <StyledImage title={value.title} alt="userPhoto" src={`${photoTempUlr}${value.photoID}`} />
        <DeletePhotoButton
          type="default"
          title="Удалить Фотографию"
          onClick={this.deletePhoto(value.photoID)}
        >
          <Icon type="delete" style={{ color: 'red' }} />
        </DeletePhotoButton>
      </ImageWrapper>
    ));

    const SortableList = SortableContainer(({ items }) => (
      <AlbumWrapper>
        {items.map((photo, index) => (
          <SortableItem key={photo.photoID} index={index} value={photo} photoNum={index} />
        ))}
      </AlbumWrapper>
    ));
    return (
      <>
        <AlbumNavigation>
          <Link to="/profile/albums">Альбомы</Link>
          <span>{` > ${title}`}</span>
        </AlbumNavigation>
        {photos.length > 0 ? (
          <>
            <SortableList axis="xy" items={photos} onSortEnd={this.onSortEnd} distance={1} />
            <ModalGateway>
              {lightboxIsOpen ? (
                <Modal onClose={this.toggleLightbox}>
                  <Carousel
                    views={images}
                    currentIndex={selectedIndex}
                    components={{ Header: CustomHeader }}
                  />
                </Modal>
              ) : null}
            </ModalGateway>
          </>
        ) : (
          <StyledRow type="flex" justify="center">
            <h4>Альбом пуст</h4>
          </StyledRow>
        )}
        <UploadPhoto albumId={photoAlbumId} loadPhotos={this.loadPhotos} />
      </>
    );
  }
}

Album.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      photoAlbumId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      fileList: PropTypes.shape({
        indexOf: PropTypes.func.isRequired,
        slice: PropTypes.func.isRequired,
      }),
    }),
  }).isRequired,
};

export default withRouter(Album);

import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { message, Button, Input, Modal } from 'antd';
import styled from 'styled-components';
import queries from '../../serverQueries';
import { StyledImage } from './Album';
import { BASE_URL } from '../../constants';

const EditSection = styled.div`
  justify-content: space-around;
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  @media (max-width: 830px) {
    flex-wrap: wrap;
  }
`;
const ChooseNewCoverSectionImage = styled(StyledImage)`
  width: 50%;
`;
const EditMenu = styled.div`
  width: 239px;
  @media (max-width: 830px) {
    margin: 0 auto;
  }
`;
const SaveChanges = styled(Button)`
  margin-top: 15px;
  margin-bottom: 15px;
`;
const EditSectionAlbumTitle = styled.div`
  margin-top: 20px;
`;
const GaleryImages = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
const EditAlbumImageWrapper = styled.div`
  position: relative;
  @media (max-width: 500px) {
    padding-top: 5px;
  }
`;
const Galery = styled.div`
  display: flex;
  flex-direction: column;
`;
const GaleryTitle = styled.div`
  align-self: center;
`;
const ChoosePhotoButton = styled(Button)`
  position: absolute;
  top: 0px;
  left: 0px;
  @media (max-width: 500px) {
    top: 5px;
  }
`;

class EditAlbum extends React.Component {
  constructor(props) {
    super(props);
    // TODO: сделать нормально
    const { title, photoAlbumId, thumbImageId } = props.location.state;
    this.state = {
      photos: [],
      photosToDelete: [],
      photoTempUlr: `${BASE_URL}api/securedPhoto/photoFromAlbum/`,
      visible: false,
      thumbImageId,
      title,
      photoAlbumId,
    };
  }

  componentDidMount() {
    this.loadPhotos();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = photo => () => {
    this.setState({
      visible: false,
      thumbImageId: photo.photoID,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
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

  handleDeletePhotos = async () => {
    const { photosToDelete } = this.state;
    try {
      // await Promise.all(photosToDelete.map(id => queries.deletePhotoFromAlbum(id)));
      await queries.deletePhotosFromAlbum(photosToDelete);
      this.setState(({ photos, thumbImageId }) => {
        const updatedPhotos = photos.filter(({ photoID }) => !photosToDelete.includes(photoID));
        const updatedThumbImageId = () => {
          if (updatedPhotos.length === 0) {
            return '';
          }
          return updatedPhotos.includes(thumbImageId) ? thumbImageId : updatedPhotos[0].photoID;
        };
        return {
          photos: updatedPhotos,
          photosToDelete: [],
          thumbImageId: updatedThumbImageId(),
        };
      });
    } catch (error) {
      // message.error('что-то пошло не так');
      await this.loadPhotos();
    }
  };

  handleSubmit = async () => {
    const { history } = this.props;
    try {
      const { photoAlbumId, title, thumbImageId } = this.state;
      await queries.updateAlbum(photoAlbumId, { title, photoId: thumbImageId });
      history.push('/profile/albums');
    } catch (err) {
      message.error('что-то пошло не так');
    }
  };

  addPhotoToDeleteArray(photoId) {
    this.setState(({ photosToDelete }) => {
      const isIncludes = photosToDelete.includes(photoId);
      return {
        photosToDelete: isIncludes
          ? photosToDelete.filter(id => id !== photoId)
          : [...photosToDelete, photoId],
      };
    });
  }

  render() {
    const {
      location: { state },
    } = this.props;
    const { history } = this.props;
    // TODO: сделать нормально
    const { photoAlbumId } = state;
    const { photoTempUlr, photos, photosToDelete, thumbImageId, visible, title } = this.state;
    const newPhotoAlbumId = {
      id: photoAlbumId,
      title,
      thumbImageId,
    };

    return (
      <div>
        <Modal
          title="Выберите новую абложку альбома"
          visible={visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          {photos.map(photo => (
            <ChooseNewCoverSectionImage
              src={`${photoTempUlr}${photo.photoID}`}
              key={photo.photoID}
              onClick={this.handleOk(photo)}
            />
          ))}
        </Modal>

        <div>
          <Link to="/profile/albums">Альбooooомы </Link>
          {'>'}
          <Link
            to={history.push({
              pathname: `/profile/albums/${photoAlbumId}`,
              state: { photoAlbumId: newPhotoAlbumId },
            })}
          >
            {' '}
            {`${title}`}{' '}
          </Link>
          {'>'} <span>Редактировать альбом</span>
        </div>
        <EditSection>
          <EditMenu>
            <div>Обложка альбома</div>
            <StyledImage
              src={thumbImageId ? `${photoTempUlr}${thumbImageId}` : `/defaultAlbumPicture.jpg`}
              alt="обложка альбома"
            />
            <Button block onClick={this.showModal}>
              Изменить
            </Button>
            <EditSectionAlbumTitle>Название альбома</EditSectionAlbumTitle>
            <Input onChange={evt => this.setState({ title: evt.target.value })} value={title} />
            <SaveChanges onClick={this.handleSubmit} block>
              Сохранить изменения
            </SaveChanges>
            {photosToDelete.length > 0 ? (
              <Button block type="danger" onClick={this.handleDeletePhotos}>
                Удалить фотографии
              </Button>
            ) : null}
          </EditMenu>

          <Galery>
            <GaleryTitle>Фотографии альбома</GaleryTitle>
            <GaleryImages>
              {photos.map(photo => (
                <EditAlbumImageWrapper key={photo.photoID}>
                  <StyledImage src={`${photoTempUlr}${photo.photoID}`} />
                  <ChoosePhotoButton
                    shape="circle"
                    icon={photosToDelete.includes(photo.photoID) ? 'check' : undefined}
                    onClick={() => this.addPhotoToDeleteArray(photo.photoID)}
                  />
                </EditAlbumImageWrapper>
              ))}
            </GaleryImages>
          </Galery>
        </EditSection>
      </div>
    );
  }
}

EditAlbum.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      photoAlbumId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      thumbImageId: PropTypes.number,
    }),
  }).isRequired,
};

export default withRouter(EditAlbum);

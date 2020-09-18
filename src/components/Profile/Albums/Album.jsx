import React from 'react';
import { Row, Button, Icon, message, Modal } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import queries from '../../../serverQueries';
import UploadPhoto from './UploadPhoto';
import ModalPhoto from './ModalPhoto';

import { BASE_URL } from '../../../constants';

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
  width: ${({ topicPageProp }) => (topicPageProp ? 'auto' : '239px')};
  margin: 3px;
  cursor: pointer;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
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
  width: ${({ topicPageProp }) => (topicPageProp ? 'auto' : '239px')};
  height: ${({ topicPageProp }) => (topicPageProp ? '100px' : '150px')};
`;

const AlbumWrapper = styled.div`
  display: flex;
  flex-direction: row;
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
      currentComments: [],
      selectedIndex: null,
      visible: false,
    };
  }

  componentDidMount() {
    this.loadPhotos();
  }

  showModal = async photoID => {
    try {
      const res = await queries.getPhotoWithData(photoID);
      const comments = res.commentDto.content;
      this.setState({
        selectedIndex: photoID,
        currentComments: comments,
        visible: true,
      });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error.response);
      message.error('что-то пошло не так');
    }
  };

  handleOk = () => {
    this.setState({
      selectedIndex: null,
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  addComment = async data => {
    const { currentComments } = this.state;
    try {
      const newComment = await queries.addCommentToPhoto(data);
      const newArrComments = [...currentComments, newComment];
      this.setState({
        currentComments: newArrComments,
      });
    } catch (error) {
      this.setState({
        selectedIndex: null,
        visible: false,
      });
    }
  };

  loadPhotos = async () => {
    const {
      history: {
        location: { state },
      },
    } = this.props;
    if (!state) {
      return;
    }
    const {
      history: {
        location: {
          state: {
            photoAlbumId: { id },
          },
        },
      },
    } = this.props;
    try {
      const photos = await queries.getPhotosFromAlbum(id);
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
    const {
      history: {
        location: { state },
      },
    } = this.props;
    if (!state) {
      message.error('Такого альбома нет.');
      return <Redirect to="/albums/" />;
    }
    const { photos, photoTempUlr, selectedIndex, currentComments, visible } = this.state;
    const {
      history: {
        location: {
          state: {
            photoAlbumId: { id, title },
          },
        },
      },
    } = this.props;
    const photoAlbumId = id;

    const SortableItem = SortableElement(({ value }) => {
      const { photoID } = value;
      return (
        <ImageWrapper onClick={() => this.showModal(photoID)}>
          <StyledImage title={value.title} alt="userPhoto" src={`${photoTempUlr}${photoID}`} />
          <DeletePhotoButton
            type="default"
            title="Удалить Фотографию"
            onClick={this.deletePhoto(photoID)}
          >
            <Icon type="delete" style={{ color: 'red' }} />
          </DeletePhotoButton>
        </ImageWrapper>
      );
    });

    const SortableList = SortableContainer(({ items }) => (
      <AlbumWrapper>
        {items.map(photo => {
          const { photoID } = photo;
          return (
            <SortableItem
              key={photoID}
              photoId={photoID}
              value={photo}
              onClick={() => this.showModal(photoID)}
            />
          );
        })}
      </AlbumWrapper>
    ));
    return (
      <>
        <AlbumNavigation>
          <Link to="/profile/albums">Альбомы</Link>
          <span>{` > ${title}`}</span>
        </AlbumNavigation>
        {photos.length > 0 ? (
          <SortableList axis="xy" items={photos} onSortEnd={this.onSortEnd} distance={1} />
        ) : (
          <StyledRow type="flex" justify="center">
            <h4>Альбом пуст</h4>
          </StyledRow>
        )}

        <Modal
          title=""
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={820}
        >
          <ModalPhoto
            idPhoto={selectedIndex}
            src={`${photoTempUlr}${selectedIndex}`}
            currentComments={currentComments}
            addComment={this.addComment}
          />
        </Modal>

        <UploadPhoto albumId={photoAlbumId} loadPhotos={this.loadPhotos} />
      </>
    );
  }
}

Album.defaultProps = {
  topicPageProp: null,
  location: null,
};

Album.propTypes = {
  history: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  location: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  topicPageProp: PropTypes.shape({
    state: PropTypes.shape({
      topicPageProp: PropTypes.string,
      title: PropTypes.string,
      photoAlbumId: PropTypes.number,
    }),
  }),
};

export default withRouter(Album);

/* eslint-disable consistent-return */
import axios from 'axios';
import { message } from 'antd';
import { BASE_URL } from '../constants';
import { paramsSerializer } from '../utils';

// TODO: По мере появления ошибок необходимо менять текст для них на нормальный, читаемый. Сейчас выводится обычный текст из error.message

class Queries {
  constructor() {
    axios.defaults.baseURL = BASE_URL;
    axios.defaults.withCredentials = true;
    axios.defaults.paramsSerializer = paramsSerializer;
    axios.interceptors.response.use(this.handleSuccess, this.handleError);
  }

  handleSuccess = response => {
    return response;
  };

  handleError = error => {
    if (error.message === 'Network Error' && !error.response) {
      message.error('Сетевая ошибка');
    }

    if (error.message === 'Request failed with status code 500') {
      message.error('Сервер не отвечает');
    }

    return Promise.reject(error);
  };

  logIn = async formData => {
    try {
      await axios.post('login', formData);
    } catch (error) {
      message.error(error.message);
    }
  };

  logOut = async () => {
    try {
      const res = await axios.get('api/logout');
      return res;
    } catch (error) {
      message.error(error.message);
    }
  };

  updateProfile = async formData => {
    try {
      const res = await axios.post('/api/updateProfile', formData);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  updateAvatar = async data => {
    try {
      const res = await axios.post('/api/avatar/set', data);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  createArticle = async (data, params) => {
    try {
      const res = await axios.post('/api/article/add', data, { params });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getArticlesByTag = async tags => {
    if (!tags) {
      const res = await axios.get(`/api/article/withoutTag`, {});
      return res.data;
    }
    const tagsString = tags.join('&tag_id=');
    try {
      const res = await axios.get(`/api/article/tag?tag_id=${tagsString}&page=0`, {});
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getTagsDtoTree = async () => {
    try {
      const res = await axios.get('/api/tags/node/tree', {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  addNewTagTree = async params => {
    try {
      const res = await axios.post('/api/tags/node/add', {}, { params });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  updateTagsTree = async params => {
    try {
      const res = await axios.put(`/api/tags/node/update`, {}, { params });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  deleteTags = async params => {
    try {
      const res = await axios.delete(`/api/tags/node/delete`, { params });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  updateArticle = async (id, data, params) => {
    try {
      const res = await axios.put(`/api/article/update/${id}`, data, { params });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getArticleById = async params => {
    try {
      const res = await axios.get(`/api/article/comments`, { params });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getArticleDraft = async () => {
    try {
      const res = await axios.get('/api/article/drafts');
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  createArticleComment = async (data, params) => {
    try {
      const res = await axios.post('/api/article/comment/add', data, {
        params,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  updateArticleComment = async (data, params) => {
    try {
      const res = await axios.put('/api/article/comment/update', data, {
        params,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  deleteArticleComment = async id => {
    try {
      const res = await axios.delete(`/api/article/comment/delete/${id}`);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getArticleTags = async () => {
    try {
      const res = await axios.get('/api/articleTag');
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getData = async page => {
    try {
      const res = await axios.get(page);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getProfileTopics = async page => {
    try {
      const res = await axios.get(`/api/topics/`, { params: { page } });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getProfileComments = async page => {
    try {
      const res = await axios.get(`/api/comments/`, { params: { page } });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getTopic = async (id, page, limit) => {
    try {
      const res = await axios.get(`/api/topic/${id}`, {
        params: { page, limit },
      });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  updateTopic = async formData => {
    try {
      const res = await axios.put('/api/topic/edit', formData);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getProfileSubscriptions = async page => {
    try {
      const res = await axios.get(`/api/subscriptions`, { params: { page } });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  addTopicToSubscriptions = async topicId => {
    try {
      const res = await axios.post(`/api/subscriptions`, {}, { params: { topicId } });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  deleteTopicFromSubscriptions = async topicId => {
    try {
      const res = await axios.delete('/api/subscriptions', { params: { topicId } });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getProfileData = async () => {
    try {
      const { data } = await axios.get('/api/currentUser');
      return data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getUserProfileData = async () => {
    try {
      const { data } = await axios.get('/api/profile');
      return data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getSubsectionTopics = async (id, page = 0) => {
    try {
      // TODO dateTime ???
      const res = await axios.get(`/api/subsection/${id}`, {
        params: { dateTime: '2099-01-01%2000%3A00%3A00', page },
      });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getAllSections = async () => {
    try {
      const res = await axios.get('/api/allsectionsandsubsections');
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getActualTopics = async () => {
    try {
      const res = await axios.get('/api/actualtopics');
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  searchByComments = async (finderTag, page) => {
    try {
      const res = await axios.get(`/api/searchComments`, { params: { finderTag, page } });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  searchByTopics = async finderTag => {
    try {
      // TODO node nodeValue ???
      const res = await axios.get(`/api/searchTopics`, {
        params: { finderTag, node: 0, nodeValue: 0 },
      });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  searchByArticles = async (title, page) => {
    try {
      const res = await axios.get(`/api/searchArticles`, {
        params: { title, page },
      });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  addComment = async newComment => {
    // TODO Перенести в компонент
    const formData = new FormData();
    formData.set('idTopic', newComment.idTopic);
    formData.set('idUser', newComment.idUser);
    formData.set('text', newComment.text);

    if (newComment.answerID) {
      formData.set('answerID', newComment.answerID);
    }

    if (newComment.image1) {
      formData.set('image1', newComment.image1.originFileObj, newComment.image1.name);
    }

    if (newComment.image2) {
      formData.set('image2', newComment.image2.originFileObj, newComment.image2.name);
    }
    try {
      const res = await axios.post('/api/comment/add', formData);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  updateComment = async editingComment => {
    // TODO Перенести в компонент
    const { commentId } = editingComment;
    const formData = new FormData();
    formData.set('idTopic', editingComment.idTopic);
    formData.set('idUser', editingComment.idUser);
    formData.set('text', editingComment.text);
    formData.set('photoIdList', JSON.stringify(editingComment.photoIdList));

    if (editingComment.image1) {
      formData.set('image1', editingComment.image1.originFileObj, editingComment.image1.name);
    }

    if (editingComment.image2) {
      formData.set('image2', editingComment.image2.originFileObj, editingComment.image2.name);
    }
    try {
      const res = await axios.put('/api/comment/update', formData, {
        params: { commentID: commentId },
      });

      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  deleteComment = async commentId => {
    try {
      const res = await axios.delete(`/api/comment/delete/${commentId}`);
      return res.status;
    } catch (error) {
      message.error(error.message);
    }
  };

  getInviteCode = async () => {
    try {
      const res = await axios.post('/api/token/invite', {});
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  sendInviteCode = async ({ mail }) => {
    try {
      const res = await axios.post(`/api/token/invite/bymail`, {}, { params: { mail } });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  registrationUserAdd = async key => {
    try {
      const res = await axios.post(`/api/registration`, {}, { params: { key } });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  registrationUser = async values => {
    try {
      const res = await axios.post('/api/token/confirm/bymail', values);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  // uploadPhoto = async photo => {
  //   // пока бекенд не готов, загружаем фото в первый и единственный альбом
  //   const res = await axios.post('/api/photos/1', photo, {
  //     withCredentials: true,
  //   });
  //   const res = await axios.post('/api/photos/1', photo);
  //   return res.data.small;
  // };

  getAlbums = async () => {
    try {
      const res = await axios.get('/api/albums');
      return res.data;
    } catch (error) {
      if (error.response.status === 400) {
        message.error('Альбомы не найдены');
      } else {
        message.error(error.message);
      }
    }
    return [];
  };

  createNewAlbum = async data => {
    try {
      const res = await axios.post(`/api/albums?albumTitle=${data}`);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  updateAlbum = async (id, params) => {
    try {
      const res = await axios.put(`/api/albums/${id}`, null, { params });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  deleteAlbum = async id => {
    try {
      const res = await axios.delete(`/api/albums/${id}`);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getPhotosFromAlbum = async id => {
    try {
      const res = await axios.get(`/api/albums/getPhotos/${id}`);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  addPhotosInAlbum = async (albumId, photosArr) => {
    try {
      const res = await axios.post(`/api/photos/${albumId}`, photosArr);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  deletePhotoFromAlbum = async photoId => {
    try {
      const res = await axios.delete(`/api/photos/${photoId}`);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  deletePhotosFromAlbum = async photoIds => {
    try {
      await axios.delete('api/photos/deleteMultiplePhoto', { data: photoIds });
    } catch (error) {
      message.error(error.message);
    }
  };

  getUsersList = async (page, query) => {
    try {
      const res = await axios.get('/api/admin/users', {
        params: { page: Number(page), ...(query ? { query } : {}) },
      });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getUserById = async id => {
    try {
      const res = await axios.get(`/api/admin/getUser/${id}`);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getUsersTree = async (id, deep) => {
    try {
      const res = await axios.get(`/api/usersTree/user/${id}/${deep}`);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  blackListRequest = async (id, dateUnblock = new Date()) => {
    try {
      const res = await axios.post('/api/admin/blocking', {
        id,
        dateUnblock: new Date(dateUnblock).toISOString(),
        // Не работает, потому что на беке ещё не смержили ветку с dev
      });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  unblockUser = async id => {
    try {
      const res = await axios.post('/api/admin/unblocking', { id });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  sendMailToAllUsers = async params => {
    try {
      const res = await axios.post('/api/admin/sendMail', params);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  postFile = async formData => {
    try {
      const res = await axios.post('/api/chat/image', formData);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  isForbidden = async () => {
    try {
      const res = await axios.get('/api/chat/isForbidden');
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getCurrentUser = async () => {
    try {
      const res = await axios.get('/api/chat/user');
      return res.data;
    } catch (error) {
      if (error.response.status === 401) {
        message.error('Пользователь не авторизован');
      } else {
        message.error(error.message);
      }
    }
  };

  getAllUsers = async () => {
    try {
      const res = await axios.get('/api/chat/users');
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getAllMessages = async page => {
    try {
      const res = await axios.get(`/api/chat/messages?page=${page}`);
      return res;
    } catch (error) {
      message.error(error.message);
    }
  };

  deleteMessage = async id => {
    try {
      const res = await axios.delete(`/api/chat/messages/${id}`);
      return res.status;
    } catch (error) {
      message.error(error.message);
    }
  };

  createNewTopic = async formData => {
    try {
      const res = await axios.post('/api/topic/new', formData);
      return res;
    } catch (error) {
      message.error(error.message);
    }
  };

  getPersonalToken = async (id, params) => {
    try {
      const res = await axios.get(`/api/private/${id}`, { params });
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getPersonalMessage = async (chatToken, page) => {
    try {
      const res = await axios.get(`/api/private/messages/${chatToken}?page=${page}`);
      return res;
    } catch (error) {
      message.error(error.message);
    }
  };

  postFilePersonalChat = async (formData, chatToken) => {
    try {
      const res = await axios.post(`/api/private/image/${chatToken}`, formData);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };

  getAnotherUserData = async id => {
    try {
      const res = await axios.get(`/api/${id}`);
      return res.data;
    } catch (error) {
      message.error(error.message);
    }
  };
}

export default new Queries();

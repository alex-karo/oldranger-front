import axios from 'axios';
import { message } from 'antd';
import { BASE_URL } from '../constants';
import { paramsSerializer } from '../utils';
import AuthorizationStatusEmitter from '../EventEmitter/EventEmmiter';

class Queries {
  constructor() {
    axios.defaults.baseURL = BASE_URL;
    axios.defaults.withCredentials = true;
    axios.defaults.paramsSerializer = paramsSerializer;
    axios.interceptors.response.use(this.handleSuccess, this.handleError);
  }

  handleSuccess = response => {
    return response?.data;
  };

  handleError = error => {
    if (error.message === 'Network Error' && !error.response) {
      message.error('Сетевая ошибка');
    }

    if (error.message === 'Request failed with status code 500') {
      message.error('Сервер не отвечает');
    }

    if (error.response.status === 401) {
      AuthorizationStatusEmitter.emit(false);
    }

    throw error;
  };

  logIn = async formData => {
    const res = await axios.post('login', formData);
    return res;
  };

  logOut = async () => {
    const res = await axios.get('api/logout');
    return res;
  };

  requestRegistration = async values => {
    const res = await axios.post('api/registration/new', values);
    return res;
  };

  updateProfile = async formData => {
    const res = await axios.post('/api/updateProfile', formData);
    return res;
  };

  updateAvatar = async data => {
    const res = await axios.post('/api/avatar/set', data);
    return res;
  };

  editEmailProfile = async (newEmail, password) => {
    const res = await axios.post(
      '/api/profile/editEmail',
      {},
      {
        params: {
          password,
          newEmail,
        },
      }
    );
    if (res === 0) {
      throw Error('Что-то не так, не удалось изменить email');
    }
    return res;
  };

  editEmailConfirm = async key => {
    const res = await axios.get(`/api/editEmail`, {
      params: {
        key,
      },
    });
    return res;
  };

  createArticle = async (data, params) => {
    const res = await axios.post('/api/article/add', data, { params });
    return res;
  };

  getArticlesByTag = async tags => {
    if (!tags) {
      const res = await axios.get(`/api/article/withoutTag`, {});
      return res;
    }
    const tagsString = tags.join('&tag_id=');
    const res = await axios.get(`/api/article/tag?tag_id=${tagsString}&page=0`, {});
    return res;
  };

  getTagsDtoTree = async () => {
    const res = await axios.get('/api/tags/node/tree');
    return res;
  };

  addNewTagTree = async params => {
    const res = await axios.post('/api/tags/node/add', {}, { params });
    return res;
  };

  updateTagsTree = async params => {
    const res = await axios.put(`/api/tags/node/update`, {}, { params });
    return res;
  };

  deleteTags = async params => {
    const res = await axios.delete(`/api/tags/node/delete`, { params });
    return res;
  };

  updateArticle = async (id, data, params) => {
    const res = await axios.put(`/api/article/update/${id}`, data, { params });
    return res;
  };

  deleteArticle = async id => {
    const res = await axios.delete(`/api/article/delete?idArticle=${id}`);
    return res;
  };

  getArticleById = async params => {
    const res = await axios.get(`/api/article/comments`, { params });
    return res;
  };

  getArticleDraft = async () => {
    const res = await axios.get('/api/article/drafts');
    return res;
  };

  createArticleComment = async (data, params) => {
    const res = await axios.post('/api/article/comment/add', data, {
      params,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return res;
  };

  updateArticleComment = async (data, params) => {
    const res = await axios.put('/api/article/comment/update', data, {
      params,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return res;
  };

  deleteArticleComment = async id => {
    const res = await axios.delete(`/api/article/comment/delete/${id}`);
    return res;
  };

  getArticleTags = async () => {
    const res = await axios.get('/api/articleTag');
    return res;
  };

  getData = async page => {
    const res = await axios.get(page);
    return res;
  };

  getProfileTopics = async page => {
    const res = await axios.get(`/api/topics/`, { params: { page } });
    return res;
  };

  getProfileComments = async page => {
    const res = await axios.get(`/api/comments/`, { params: { page } });
    return res;
  };

  getTopic = async (id, page, limit) => {
    const res = await axios.get(`/api/topic/${id}`, {
      params: { page, limit },
    });
    return res;
  };

  updateTopic = async formData => {
    const res = await axios.put('/api/topic/edit', formData);
    return res;
  };

  getProfileSubscriptions = async page => {
    const res = await axios.get(`/api/subscriptions`, { params: { page } });
    return res;
  };

  addTopicToSubscriptions = async topicId => {
    const res = await axios.post(`/api/subscriptions`, {}, { params: { topicId } });
    return res;
  };

  deleteTopicFromSubscriptions = async topicId => {
    const res = await axios.delete('/api/subscriptions', { params: { topicId } });
    return res;
  };

  getProfileData = async () => {
    const res = await axios.get('/api/currentUser');
    return res;
  };

  getUserProfileData = async () => {
    const { data } = await axios.get('/api/profile');
    return data;
  };

  getSubsectionTopics = async (id, page = 0) => {
    // TODO dateTime ???
    const res = await axios.get(`/api/subsection/${id}`, {
      params: { dateTime: '2099-01-01%2000%3A00%3A00', page },
    });
    return res;
  };

  getAllSections = async () => {
    const res = await axios.get('/api/allsectionsandsubsections');
    return res;
  };

  getActualTopics = async () => {
    const res = await axios.get('/api/actualtopics');
    return res;
  };

  searchByComments = async (finderTag, page) => {
    const res = await axios.get(`/api/searchComments`, { params: { finderTag, page } });
    return res;
  };

  searchByTopics = async finderTag => {
    // TODO node nodeValue ???
    const res = await axios.get(`/api/searchTopics`, {
      params: { finderTag, node: 0, nodeValue: 0 },
    });
    return res;
  };

  searchByArticles = async (title, page) => {
    const res = await axios.get(`/api/searchArticles`, {
      params: { title, page },
    });
    return res;
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

    const res = await axios.post('/api/comment/add', formData);
    return res;
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

    const res = await axios.put('/api/comment/update', formData, {
      params: { commentID: commentId },
    });

    return res;
  };

  deleteComment = async commentId => {
    const res = await axios.delete(`/api/comment/delete/${commentId}`);
    return res.status;
  };

  addCommentToPhoto = async params => {
    const res = await axios.post('/api/photo/comment/add', null, {
      params,
    });
    return res.data;
  };

  getPhotoWithData = async id => {
    const res = await axios.get(`/api/photos/${id}`, { params: { limit: 100 } });
    return res;
  };

  getInviteCode = async () => {
    const res = await axios.post('/api/token/invite', {});
    return res;
  };

  sendInviteCode = async ({ mail }) => {
    const res = await axios.post(`/api/token/invite/bymail`, {}, { params: { mail } });
    return res;
  };

  registrationUserAdd = async key => {
    const res = await axios.post(`/api/registration`, {}, { params: { key } });
    return res;
  };

  registrationUser = async values => {
    const res = await axios.post('/api/token/confirm/bymail', values);
    return res;
  };

  getAlbums = async () => {
    const res = await axios.get('/api/albums');
    return res;
  };

  getAllAlbums = async () => {
    const res = await axios.get('/api/albums/all');
    return res.data;
  };

  createNewAlbum = async data => {
    const res = await axios.post(`/api/albums?albumTitle=${data}`);
    return res;
  };

  updateAlbum = async (id, params) => {
    const res = await axios.put(`/api/albums/${id}`, null, { params });
    return res;
  };

  deleteAlbum = async id => {
    const res = await axios.delete(`/api/albums/${id}`);
    return res;
  };

  getPhotosFromAlbum = async id => {
    const res = await axios.get(`/api/albums/getPhotos/${id}`);
    return res;
  };

  getSecuredPhoto = async id => {
    const res = await axios.get(`/api/securedPhoto/photoFromAlbum/${id}`);
    return res.data;
  };

  addPhotosInAlbum = async (albumId, photosArr) => {
    const res = await axios.post(`/api/photos/${albumId}`, photosArr);
    return res;
  };

  deletePhotoFromAlbum = async photoId => {
    const res = await axios.delete(`/api/photos/${photoId}`);
    return res;
  };

  deletePhotosFromAlbum = async photoIds => {
    await axios.delete('api/photos/deleteMultiplePhoto', { data: photoIds });
  };

  getUsersList = async (page, query) => {
    const res = await axios.get('/api/admin/users', {
      params: { page: Number(page), ...(query ? { query } : {}) },
    });
    return res;
  };

  getUserById = async id => {
    const res = await axios.get(`/api/admin/getUser/${id}`);
    return res;
  };

  getUsersTree = async (id, deep) => {
    const res = await axios.get(`/api/usersTree/user/${id}/${deep}`);
    return res;
  };

  blackListRequest = async (id, dateUnblock = new Date()) => {
    const res = await axios.post('/api/admin/blocking', {
      id,
      dateUnblock: new Date(dateUnblock).toISOString(),
      // Не работает, потому что на беке ещё не смержили ветку с dev
    });
    return res;
  };

  prohibitionWrite = async (id, banType, dateUnblock = new Date()) => {
    const res = await axios.post('/api/admin/writingBan', {
      id,
      banType,
      dateUnblock: new Date(dateUnblock).toISOString(),
    });
    return res;
  };

  unblockUser = async id => {
    const res = await axios.post('/api/admin/unblocking', { id });
    return res;
  };

  unmuteUser = async id => {
    const res = await axios.post('/api/admin/unmute', { id });
    return res;
  };

  sendPhotos = async (formData, config) => {
    const res = await axios.post('api/photos/imageDownload', formData, config);
    return res;
  };

  sendMailToAllUsers = async params => {
    const res = await axios.post('/api/admin/sendMail', params);
    return res;
  };

  postFile = async formData => {
    const res = await axios.post('/api/chat/image', formData);
    return res;
  };

  isForbidden = async () => {
    const res = await axios.get('/api/chat/isForbidden');
    return res;
  };

  getCurrentUser = async () => {
    const res = await axios.get('/api/chat/user');
    return res;
  };

  getAllUsers = async () => {
    const res = await axios.get('/api/chat/users');
    return res;
  };

  getAllMessages = async page => {
    const res = await axios.get(`/api/chat/messages?page=${page}`);
    return res;
  };

  deleteMessage = async id => {
    const res = await axios.delete(`/api/chat/messages/${id}`);
    return res.status;
  };

  createNewTopic = async formData => {
    const res = await axios.post('/api/topic/new', formData);
    return res;
  };

  getPersonalToken = async (id, params) => {
    const res = await axios.get(`/api/private/${id}`, { params });
    return res;
  };

  getPersonalMessage = async (chatToken, page) => {
    const res = await axios.get(`/api/private/messages/${chatToken}?page=${page}`);
    return res;
  };

  postFilePersonalChat = async (formData, chatToken) => {
    const res = await axios.post(`/api/private/image/${chatToken}`, formData);
    return res;
  };

  getAnotherUserData = async id => {
    const res = await axios.get(`/api/${id}`);
    return res;
  };

  getFilteredUsers = async (page, query) => {
    const res = await axios.get('/api/admin/users', {
      params: { page: Number(page), ...(query ? { query } : {}) },
    });
    return res;
  };
}

export default new Queries();

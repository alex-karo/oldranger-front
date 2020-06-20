import axios from 'axios';
import { message } from 'antd';
import { BASE_URL } from '../constants';
import { paramsSerializer } from '../utils';

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

    if (error.response.status === 401) {
      message.error('Пользователь не авторизован');
    }

    message.error(error.message);
  };

  logIn = async formData => {
    await axios.post('login', formData);
  };

  logOut = async () => {
    const res = await axios.get('api/logout');
    return res;
  };

  requestRegistration = async values => {
    const res = await axios.post('api/registration/new', values);
    return res.data;
  };

  updateProfile = async formData => {
    const res = await axios.post('/api/updateProfile', formData);
    return res.data;
  };

  updateAvatar = async data => {
    const res = await axios.post('/api/avatar/set', data);
    return res.data;
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
    if (res.data === 0) {
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
    return res.data;
  };

  getArticlesByTag = async tags => {
    if (!tags) {
      const res = await axios.get(`/api/article/withoutTag`, {});
      return res.data;
    }
    const tagsString = tags.join('&tag_id=');
    const res = await axios.get(`/api/article/tag?tag_id=${tagsString}&page=0`, {});
    return res.data;
  };

  getTagsDtoTree = async () => {
    const res = await axios.get('/api/tags/node/tree', {
      withCredentials: true,
    });
    return res.data;
  };

  addNewTagTree = async params => {
    const res = await axios.post('/api/tags/node/add', {}, { params });
    return res.data;
  };

  updateTagsTree = async params => {
    const res = await axios.put(`/api/tags/node/update`, {}, { params });
    return res.data;
  };

  deleteTags = async params => {
    const res = await axios.delete(`/api/tags/node/delete`, { params });
    return res.data;
  };

  updateArticle = async (id, data, params) => {
    const res = await axios.put(`/api/article/update/${id}`, data, { params });
    return res.data;
  };

  getArticleById = async params => {
    const res = await axios.get(`/api/article/comments`, { params });
    return res.data;
  };

  getArticleDraft = async () => {
    const res = await axios.get('/api/article/drafts');
    return res.data;
  };

  createArticleComment = async (data, params) => {
    const res = await axios.post('/api/article/comment/add', data, {
      params,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return res.data;
  };

  updateArticleComment = async (data, params) => {
    const res = await axios.put('/api/article/comment/update', data, {
      params,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return res.data;
  };

  deleteArticleComment = async id => {
    const res = await axios.delete(`/api/article/comment/delete/${id}`);
    return res.data;
  };

  getArticleTags = async () => {
    const res = await axios.get('/api/articleTag');
    return res.data;
  };

  getData = async page => {
    const res = await axios.get(page);
    return res.data;
  };

  getProfileTopics = async page => {
    const res = await axios.get(`/api/topics/`, { params: { page } });
    return res.data;
  };

  getProfileComments = async page => {
    const res = await axios.get(`/api/comments/`, { params: { page } });
    return res.data;
  };

  getTopic = async (id, page, limit) => {
    const res = await axios.get(`/api/topic/${id}`, {
      params: { page, limit },
    });
    return res.data;
  };

  updateTopic = async formData => {
    const res = await axios.put('/api/topic/edit', formData);
    return res.data;
  };

  getProfileSubscriptions = async page => {
    const res = await axios.get(`/api/subscriptions`, { params: { page } });
    return res.data;
  };

  addTopicToSubscriptions = async topicId => {
    const res = await axios.post(`/api/subscriptions`, {}, { params: { topicId } });
    return res.data;
  };

  deleteTopicFromSubscriptions = async topicId => {
    const res = await axios.delete('/api/subscriptions', { params: { topicId } });
    return res.data;
  };

  getProfileData = async () => {
    const { data } = await axios.get('/api/currentUser');
    return data;
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
    return res.data;
  };

  getAllSections = async () => {
    const res = await axios.get('/api/allsectionsandsubsections');
    return res.data;
  };

  getActualTopics = async () => {
    const res = await axios.get('/api/actualtopics');
    return res.data;
  };

  searchByComments = async (finderTag, page) => {
    const res = await axios.get(`/api/searchComments`, { params: { finderTag, page } });
    return res.data;
  };

  searchByTopics = async finderTag => {
    // TODO node nodeValue ???
    const res = await axios.get(`/api/searchTopics`, {
      params: { finderTag, node: 0, nodeValue: 0 },
    });
    return res.data;
  };

  searchByArticles = async (title, page) => {
    const res = await axios.get(`/api/searchArticles`, {
      params: { title, page },
    });
    return res.data;
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
    return res.data;
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

    return res.data;
  };

  deleteComment = async commentId => {
    const res = await axios.delete(`/api/comment/delete/${commentId}`);
    return res.status;
  };

  getInviteCode = async () => {
    const res = await axios.post('/api/token/invite', {});
    return res.data;
  };

  sendInviteCode = async ({ mail }) => {
    const res = await axios.post(`/api/token/invite/bymail`, {}, { params: { mail } });
    return res.data;
  };

  registrationUserAdd = async key => {
    const res = await axios.post(`/api/registration`, {}, { params: { key } });
    return res.data;
  };

  registrationUser = async values => {
    const res = await axios.post('/api/token/confirm/bymail', values);
    return res.data;
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
    const res = await axios.get('/api/albums');
    return res.data;
  };

  createNewAlbum = async data => {
    const res = await axios.post(`/api/albums?albumTitle=${data}`);
    return res.data;
  };

  updateAlbum = async (id, params) => {
    const res = await axios.put(`/api/albums/${id}`, null, { params });
    return res.data;
  };

  deleteAlbum = async id => {
    const res = await axios.delete(`/api/albums/${id}`);
    return res.data;
  };

  getPhotosFromAlbum = async id => {
    const res = await axios.get(`/api/albums/getPhotos/${id}`);
    return res.data;
  };

  addPhotosInAlbum = async (albumId, photosArr) => {
    const res = await axios.post(`/api/photos/${albumId}`, photosArr);
    return res.data;
  };

  deletePhotoFromAlbum = async photoId => {
    const res = await axios.delete(`/api/photos/${photoId}`);
    return res.data;
  };

  deletePhotosFromAlbum = async photoIds => {
    await axios.delete('api/photos/deleteMultiplePhoto', { data: photoIds });
  };

  getUsersList = async (page, query) => {
    const res = await axios.get('/api/admin/users', {
      params: { page: Number(page), ...(query ? { query } : {}) },
    });
    return res.data;
  };

  getUserById = async id => {
    const res = await axios.get(`/api/admin/getUser/${id}`);
    return res.data;
  };

  getUsersTree = async (id, deep) => {
    const res = await axios.get(`/api/usersTree/user/${id}/${deep}`);
    return res.data;
  };

  blackListRequest = async (id, dateUnblock = new Date()) => {
    const res = await axios.post('/api/admin/blocking', {
      id,
      dateUnblock: new Date(dateUnblock).toISOString(),
      // Не работает, потому что на беке ещё не смержили ветку с dev
    });
    return res.data;
  };

  unblockUser = async id => {
    const res = await axios.post('/api/admin/unblocking', { id });
    return res.data;
  };

  sendMailToAllUsers = async params => {
    const res = await axios.post('/api/admin/sendMail', params);
    return res.data;
  };

  postFile = async formData => {
    const res = await axios.post('/api/chat/image', formData);
    return res.data;
  };

  isForbidden = async () => {
    const res = await axios.get('/api/chat/isForbidden');
    return res.data;
  };

  getCurrentUser = async () => {
    const res = await axios.get('/api/chat/user');
    return res.data;
  };

  getAllUsers = async () => {
    const res = await axios.get('/api/chat/users');
    return res.data;
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
    return res.data;
  };

  getPersonalMessage = async (chatToken, page) => {
    const res = await axios.get(`/api/private/messages/${chatToken}?page=${page}`);
    return res;
  };

  postFilePersonalChat = async (formData, chatToken) => {
    const res = await axios.post(`/api/private/image/${chatToken}`, formData);
    return res.data;
  };

  getAnotherUserData = async id => {
    const res = await axios.get(`/api/${id}`);
    return res.data;
  };
}

export default new Queries();

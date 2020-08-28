export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const BASE_IMG_URL = `${BASE_URL}img/`;
export const SECURED_ALBUM_URL = `${BASE_URL}api/securedPhoto/photoFromAlbum/`;
export const PUBLIC_IMG_URL = '';
export const DEFAULT_COMMENT_PICTURE = `${PUBLIC_IMG_URL}/defaultCommentPicture.jpg`;
export const DEFAULT_AVATAR_PICTURE = `${PUBLIC_IMG_URL}/defaultAvatarPicture.png`;
export const DEFAULT_ALBUM_PICTURE = `${PUBLIC_IMG_URL}/defaultAlbumPicture.png`;

export const userRoles = {
  admin: 'ROLE_ADMIN',
  moderator: 'ROLE_MODERATOR',
};

export default userRoles;

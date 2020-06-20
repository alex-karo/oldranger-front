import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'antd';
import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { BASE_IMG_URL } from '../../constants';

const StyledCard = styled.div`
  position: relative;
  padding: 20px 0 10px 20px;
  margin-top: 8px;
  margin-bottom: 30px;
  border: 1px solid #555;
  border-radius: 5px;
  .title {
    position: absolute;
    left: 4px;
    top: 0;
    transform: translateY(-50%);
    padding: 5px 10px;
    line-height: 1;
    color: #fff;
    background-color: #2b7de9;
    border-radius: 4px;
  }
  .field {
    display: flex;
    margin: 2px 0;
    &-name {
      width: 30%;
    }
  }
`;

const StyledMainProfile = styled.div`
  display: flex;
  flex-wrap: wrap;
  .sidebar {
    width: 20%;
    margin: 0 auto 5%;
    .title {
      margin: 20px 0;
    }
    .avatar {
      display: block;
      max-width: 200px;
      width: 100%;
      height: auto;
      margin: 0 auto;
    }
    .button {
      margin-bottom: 10px;
    }
  }
  .meta {
    width: 75%;
    margin: auto;
  }
  @media (max-width: 768px) {
    .sidebar,
    .meta {
      width: 100%;
    }
  }
`;

const ProfileData = ({ user, self, id }) => {
  const gender = user.gender && (user.gender === 'MALE' ? 'муж.' : 'жен.');
  const btn = self ? (
    <>
      <Link to="/profile/avatar">
        <Button type="primary" block className="button">
          Загрузить аватар
        </Button>
      </Link>
      <Link to="/profile/edit">
        <Button type="primary" block className="button">
          Редактировать
        </Button>
      </Link>
      <Link to="/profile/editEmail">
        <Button type="primary" block className="button">
          Изменить почтовый адрес
        </Button>
      </Link>
    </>
  ) : (
    <Link to={`/private/${id}`}>
      <Button type="primary" block className="button">
        Написать
      </Button>
    </Link>
  );

  return (
    <StyledMainProfile>
      <div className="sidebar">
        <img src={`${BASE_IMG_URL}${user.avatar}`} alt="avatar" className="avatar" />
        <h2 className="title">
          {user.firstName} {user.lastName}
        </h2>
        {btn}
      </div>
      <div className="meta">
        <StyledCard>
          <h3 className="title">Общее</h3>
          <div className="field">
            <div className="field-name">Ник:</div>
            <div className="field-value">{user.nickName || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Имя:</div>
            <div className="field-value">{user.firstName || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Фамилия:</div>
            <div className="field-value">{user.lastName || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Город:</div>
            <div className="field-value">{user.city || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Страна:</div>
            <div className="field-value">{user.country || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Дата рождения:</div>
            <div className="field-value">{user.birthday || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Пол:</div>
            <div className="field-value">{gender || '-'}</div>
          </div>
        </StyledCard>
        <StyledCard>
          <h3 className="title">Контакты</h3>
          <div className="field">
            <div className="field-name">Email:</div>
            <div className="field-value">{user.email || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Моб. телефон:</div>
            <div className="field-value">{user.phoneNumber || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">VK:</div>
            <div className="field-value">{user.socialVk || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Facebook:</div>
            <div className="field-value">{user.socialFb || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Twitter:</div>
            <div className="field-value">{user.socialTw || '-'}</div>
          </div>
        </StyledCard>
        <StyledCard>
          <h3 className="title">Статистика</h3>
          <div className="field">
            <div className="field-name">Зарегистрирован:</div>
            <div className="field-value">
              {user.regDate ? format(new Date(user.regDate), 'dd.MM.yyyy HH:mm') : '-'}
            </div>
          </div>
          <div className="field">
            <div className="field-name">Сообщений:</div>
            <div className="field-value">{user.messageCount || '-'}</div>
          </div>
          <div className="field">
            <div className="field-name">Последнее сообщение:</div>
            <div className="field-value">
              {user.lastComment ? format(new Date(user.lastComment), 'dd.MM.yyyy HH:mm') : '-'}
            </div>
          </div>
          <div className="field">
            <div className="field-name">Последний логин:</div>
            <div className="field-value">
              {user.lastVisit
                ? formatDistanceToNow(new Date(user.lastVisit), { locale: ru, addSuffix: true })
                : '-'}
            </div>
          </div>
          <div className="field">
            <div className="field-name">Начал тем:</div>
            <div className="field-value">{user.topicStartCount || '-'}</div>
          </div>
        </StyledCard>
        <StyledCard>
          <h3 className="title">Про меня</h3>
          <div className="field">{user.aboutMe}</div>
        </StyledCard>
      </div>
    </StyledMainProfile>
  );
};

ProfileData.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  id: PropTypes.number.isRequired,
  self: PropTypes.bool,
};

ProfileData.defaultProps = {
  self: false,
};

export default ProfileData;

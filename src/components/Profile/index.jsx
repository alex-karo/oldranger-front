import React, { useState, useContext } from 'react';
import { Switch, Route, useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import { Radio } from 'antd';

import Context from '../Context';

import EditProfile from './EditProfile';
import EditAvatar from './EditAvatar';

import MainProfile from './MainProfile';
import Messages from './Messages';
import Themes from './Themes';
import Subscriptions from './Subscriptions';
import Invite from './Invite';
import Albums from './Albums/Albums';
import Album from './Albums/Album';
import EditAlbum from './Albums/EditAlbum';

const Profile = () => {
  const { path } = useRouteMatch();
  const {
    user: { role },
  } = useContext(Context);
  const history = useHistory();
  const { pathname } = useLocation();
  const endPoint = pathname.split('/').pop();
  const [currentPage, setPage] = useState(endPoint === 'profile' ? '' : endPoint);

  const changePage = ({ target: { value } }) => {
    history.push(`${path}/${value}`);
    setPage(value);
  };

  return (
    <Switch>
      <Route path={`${path}/edit`} component={EditProfile} />
      <Route path={`${path}/avatar`} component={EditAvatar} />
      <Route path="*">
        <h2>Профиль пользоkвателя</h2>
        <div>
          <Radio.Group value={currentPage} onChange={changePage} style={{ marginBottom: 20 }}>
            <Radio.Button value="">Профиль</Radio.Button>
            <Radio.Button value="messages">Сообщения</Radio.Button>
            <Radio.Button value="themes">Темы</Radio.Button>
            <Radio.Button value="subscriptions">Подписки</Radio.Button>
            {role === 'ROLE_PROSPECT' || (
              <Radio.Button value="invite">Пригласить друга</Radio.Button>
            )}
            <Radio.Button value="albums">Мои альбомы</Radio.Button>
          </Radio.Group>
        </div>
        <Switch>
          <Route exact path={`${path}/`} component={MainProfile} />
          <Route path={`${path}/messages`} component={Messages} />
          <Route path={`${path}/themes`} component={Themes} />
          <Route path={`${path}/subscriptions`} component={Subscriptions} />
          {role === 'ROLE_PROSPECT' || <Route path={`${path}/invite`} component={Invite} />}
          <Route exact path={`${path}/albums/:id`} component={Album} />
          <Route exact path={`${path}/albums`} component={Albums} />
          <Route exact path={`${path}/albums/editAlbum/:id`} component={EditAlbum} />
        </Switch>
      </Route>
    </Switch>
  );
};

export default Profile;

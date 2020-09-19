import React from 'react';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { userRoles } from '../constants';
import Albums from '../components/Albums/Albums';
import PrivateRoute from './PrivateRoute';
import Album from '../components/Albums/Album';
import MainAlbums from '../components/hoc/MainAlbums';

const AlbumsRoute = ({ isLogin, role }) => {
  return (
    <>
      <Switch>
        <PrivateRoute
          isAllowed={isLogin}
          isEditable={role === userRoles.admin}
          exact
          path="/albums"
          role={role}
          component={() => MainAlbums(Albums)}
        />
        <PrivateRoute
          isAllowed={isLogin}
          exact
          path="/albums/:albumId"
          component={() => MainAlbums(Album)}
        />
      </Switch>
    </>
  );
};

AlbumsRoute.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  role: PropTypes.string,
};

AlbumsRoute.defaultProps = {
  role: null,
};

export default AlbumsRoute;

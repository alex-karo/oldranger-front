import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import Login from '../components/Login';
import Registration from '../components/Registration';
import RegistrationAccept from '../components/RegistrationAccept';
import FormCommunicationAdmin from '../components/FormCommunicationAdmin';

const AuthRoute = ({ isLogin, connect }) => {
  return (
    <>
      <Route path="/request-invite">
        {isLogin ? <Redirect to="/" /> : <FormCommunicationAdmin />}
      </Route>
      <Route path="/invite">{isLogin ? <Redirect to="/" /> : <Registration />}</Route>
      <Route path="/registration-accept" component={RegistrationAccept} />
      <Route path="/login">{isLogin ? <Redirect to="/" /> : <Login connect={connect} />}</Route>
    </>
  );
};

AuthRoute.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  connect: PropTypes.func.isRequired,
};

export default AuthRoute;

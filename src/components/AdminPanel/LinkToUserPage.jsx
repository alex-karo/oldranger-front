import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import serverQueries from '../../serverQueries';

const LinkToUserPage = ({ id }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    serverQueries.getUserById(id).then(setUser);
  }, [id]);

  const { nickName } = user;

  return (
    <>
      <Link to={`/admin-panel/users/${id}`}>{nickName}</Link>{' '}
    </>
  );
};

LinkToUserPage.propTypes = {
  id: PropTypes.number.isRequired,
};

export default LinkToUserPage;

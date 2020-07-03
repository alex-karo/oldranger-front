import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Icon } from 'antd';
import serverQueries from '../../serverQueries';

const UserBanStatus = ({ id }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    serverQueries.getUserById(id).then(setUser);
  }, [id]);

  const { accountNonLocked } = user;

  if (!isEmpty(user) && !accountNonLocked) {
    return <Icon type="lock" style={{ color: '#eb2f96' }} />;
  }

  return <Icon type="unlock" style={{ color: '#eb2f96' }} />;
};

UserBanStatus.propTypes = {
  id: PropTypes.number.isRequired,
};

export default UserBanStatus;

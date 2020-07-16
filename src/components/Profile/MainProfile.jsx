import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Result } from 'antd';
import ProfileData from './ProfileData';
import { withGetData } from '../hoc';

const MainProfile = ({ isLoading, data: user, error }) => {
  if (error) {
    return (
      <Result status="500" title="500" subTitle="Извините на сервере возникла неожиданная ошибка" />
    );
  }

  if (isLoading) {
    return <Spin />;
  }
  return <ProfileData self user={user} />;
};

MainProfile.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  error: PropTypes.bool.isRequired,
};

export default withGetData(MainProfile, 'api/profile');

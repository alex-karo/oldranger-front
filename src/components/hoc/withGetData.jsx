import React, { useState, useEffect } from 'react';

import queries from '../../serverQueries';

const getData = async (url, { changeDataState, changeLoadingState, changeErrorState }) => {
  changeLoadingState(true);
  const data = await queries.getData(url).catch(() => changeErrorState(true));
  changeDataState(data);
  changeLoadingState(false);
};

const withGetData = (WrappedComponent, url) => {
  return props => {
    const [isLoading, changeLoadingState] = useState(true);
    const [data, changeDataState] = useState({});
    const [error, changeErrorState] = useState(false);

    useEffect(() => {
      getData(url, { changeDataState, changeLoadingState, changeErrorState });
    }, []);

    return <WrappedComponent {...props} isLoading={isLoading} data={data} error={error} />;
  };
};

export default withGetData;

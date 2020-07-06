import React from 'react';
import { useHistory } from 'react-router-dom';
import queries from '../../serverQueries';
import ArticleForm from '../forms/ArticleForm';
import { StyledHeader } from '../Articles/styled';

const createArticle = async (photos, params) => {
  // console.log('params', params);
  // console.log('photos', photos.getAll('photos'))
  const data = await queries.createArticle(photos, params);
  return data;
};

const ArticleCreate = () => {
  const history = useHistory();
  return (
    <>
      <StyledHeader>Создание статьи</StyledHeader>
      <ArticleForm
        onSubmit={createArticle}
        onSubmitSuccess={({ id }) => history.push(`/article/${id}`)}
      />
    </>
  );
};

export default ArticleCreate;

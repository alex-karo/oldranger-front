import React from 'react';
import { useHistory } from 'react-router-dom';
import queries from '../../serverQueries';
import ArticleForm from '../forms/ArticleForm';
import { StyledHeader } from '../Articles/styled';

const createArticle = async values => {
  const { title, text, ...params } = values;
  const data = await queries.createArticle({ title, text }, params);
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

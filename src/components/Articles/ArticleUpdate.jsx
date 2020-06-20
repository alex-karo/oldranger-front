import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Spin } from 'antd';
import queries from '../../serverQueries';
import ArticleForm from '../forms/ArticleForm';
import useArticleFetching from '../../hooks/useArticleFetching';
import { StyledCenteredContainer, StyledHeader } from './styled';

const updateArticle = id => async values => {
  const { title, text, ...params } = values;
  const data = await queries.updateArticle(id, { title, text }, params);
  return data;
};

const ArticleUpdate = () => {
  const history = useHistory();
  const { articleId } = useParams();

  const { error, loading, results } = useArticleFetching(articleId);

  if (loading || error) {
    return (
      <StyledCenteredContainer>
        {loading ? <Spin /> : 'Не удалось загрузить статью'}
      </StyledCenteredContainer>
    );
  }

  const {
    article: { title, text, articleTags, isHideToAnon = true, draft: isDraft },
  } = results;
  const tagsId = articleTags.map(tag => tag.id);

  return (
    <>
      <StyledHeader>Редактирование статьи</StyledHeader>
      <ArticleForm
        initialValues={{ title, text, tagsId, isDraft, isHideToAnon }}
        onSubmit={updateArticle(articleId)}
        onSubmitSuccess={({ id }) => history.push(`/article/${id}`)}
      />
    </>
  );
};

export default ArticleUpdate;

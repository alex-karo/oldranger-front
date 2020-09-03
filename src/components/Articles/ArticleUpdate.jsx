import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Spin, Button } from 'antd';
import queries from '../../serverQueries';
import ArticleForm from '../forms/ArticleForm';
import useArticleFetching from '../../hooks/useArticleFetching';
import { StyledCenteredContainer, StyledHeader } from './styled';
import context from '../Context';

const updateArticle = async (id, results, history) => {
  const { title, text, isDraft, ...params } = results;
  await queries.updateArticle(id, { title, text }, { ...params, isDraft });
  history.push(isDraft ? `/admin-panel/articleDraft` : `/article/${id}`);
};

const deleteArticle = async (id, history) => {
  await queries.deleteArticle(id);
  history.push('/articles');
};

const ArticleUpdate = () => {
  const history = useHistory();
  const { articleId } = useParams();
  const {
    user: { role },
  } = useContext(context);

  const renderDeleteArticle = () => {
    if (role === 'ROLE_ADMIN') {
      return (
        <Button type="danger" onClick={() => deleteArticle(articleId, history)}>
          Удалить статью
        </Button>
      );
    }
    return null;
  };

  const handleSubmit = (id, results) => {
    updateArticle(id, results, history);
  };

  const { error, loading, results } = useArticleFetching(articleId);

  if (loading || error) {
    return (
      <StyledCenteredContainer>
        {loading ? <Spin /> : 'Не удалось загрузить статью'}
      </StyledCenteredContainer>
    );
  }

  const {
    article: { id, title, text, articleTags, isHideToAnon = true, draft: isDraft },
  } = results;
  const tagsId = articleTags.map(tag => tag.id);
  return (
    <>
      <StyledHeader>Редактирование статьи</StyledHeader>
      <ArticleForm
        initialValues={{ title, text, tagsId, isDraft, isHideToAnon }}
        onSubmit={result => handleSubmit(articleId, result)}
        onSubmitSuccess={() => history.push(`/article/${id}`)}
      />
      {renderDeleteArticle()}
    </>
  );
};

export default ArticleUpdate;

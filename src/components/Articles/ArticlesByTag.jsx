import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import queries from '../../serverQueries';
import { Column } from './styled';
import Article from './Article';
import useQuery from '../../hooks/useQuery';

const ArticlesByTag = () => {
  const [articles, setArticles] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const tagsAtr = useQuery().tags;

  useEffect(() => {
    if (!tagsAtr) {
      queries
        .getArticlesByTag()
        .then(el => {
          setArticles(el.content);
          setIsEmpty(el.empty);
        })
        .catch(() => setIsEmpty(true));
    } else {
      queries
        .getArticlesByTag(tagsAtr.split('_'))
        .then(el => {
          setArticles(el.content.reverse());
          setIsEmpty(el.empty);
        })
        .catch(() => setIsEmpty(true));
    }
  }, [tagsAtr]);

  const LoadOrNotFound = isEmpty ? <h1>Статей по этому тегу не найдено</h1> : <Spin />;
  return (
    <Column>
      {articles.length === 0 ? LoadOrNotFound : null}
      {articles.map(el => {
        return <Article key={el.id} articleInfo={el} isPreview />;
      })}
    </Column>
  );
};

ArticlesByTag.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default ArticlesByTag;

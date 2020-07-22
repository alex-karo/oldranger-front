import React, { useState, useEffect } from 'react';
import { Spin, Pagination } from 'antd';
import PropTypes from 'prop-types';
import queries from '../../serverQueries';
import { Column } from './styled';
import Article from './Article';
import useQuery from '../../hooks/useQuery';

const ArticlesByTag = () => {
  const [articles, setArticles] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 0 });
  const tagsAtr = useQuery().tags;

  const getArticlesToState = paginationValue => {
    if (!tagsAtr) {
      queries.getArticlesByTag(null, paginationValue).then(el => {
        setArticles(el.content);
        setIsEmpty(el.empty);
        setPagination({ currentPage: paginationValue, totalElements: el.totalElements });
      });
    } else {
      queries
        .getArticlesByTag(tagsAtr.split('_'), paginationValue)
        .then(el => {
          setArticles(el.content.reverse());
          setIsEmpty(el.empty);
          setPagination({ currentPage: paginationValue, totalElements: el.totalElements });
        })
        .catch(() => setIsEmpty(true));
    }
  };

  useEffect(() => {
    setPagination({ ...pagination, currentPage: 0 });
    const firstPage = 0;

    getArticlesToState(firstPage);
  }, [tagsAtr]);

  useEffect(() => {
    getArticlesToState(pagination.currentPage);
  }, [pagination.currentPage]);

  const onChangePageNumber = pageNumber => {
    setPagination({ ...pagination, currentPage: pageNumber - 1 });
  };

  const LoadOrNotFound = isEmpty ? <h1>Статей по этому тегу не найдено</h1> : <Spin />;
  return (
    <Column>
      {articles.length === 0 ? LoadOrNotFound : null}
      {articles.map(el => {
        return <Article key={el.id} articleInfo={el} isPreview />;
      })}
      <Pagination
        defaultCurrent={1}
        current={pagination.currentPage + 1}
        total={pagination.totalElements}
        onChange={onChangePageNumber}
      />
    </Column>
  );
};

ArticlesByTag.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default ArticlesByTag;

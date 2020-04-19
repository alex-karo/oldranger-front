import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Tag, Icon } from 'antd';
import { Link } from 'react-router-dom';
import context from '../Context';
import { ArticleContentView, ArticleTitle } from '../commons/HTMLContentViews';
import { StyledArticle, StyledMeta, StyledTags, StyledUserInfo, StyledDate } from './styled/index';
import { dateToDateDistance } from '../../utils/index';

const Article = props => {
  const { articleInfo, isPreview } = props;
  const {
    user: { role },
  } = useContext(context);

  return (
    <StyledArticle>
      <ArticleTitle>
        {isPreview ? (
          <Link style={{ color: 'black' }} to={`/article/${articleInfo.id}`}>
            {articleInfo.title}
          </Link>
        ) : (
            articleInfo.title
          )}
        {role === 'ROLE_ADMIN' ? (
          <Link
            style={{
              fontSize: '16px',
              'margin-left': '6px',
              color: '#24292e',
              'line-height': '40px',
            }}
            to={`/article/${articleInfo.id}/update`}
          >
            <Icon type="edit" theme="outlined" />
          </Link>
        ) : null}
      </ArticleTitle>
      <ArticleContentView dangerouslySetInnerHTML={{ __html: articleInfo.text }} />
      <StyledMeta>
        <StyledTags>
          {articleInfo.articleTags.map(tag => {
            return (
              <Tag key={tag.id} color="geekblue">
                {tag.name}
              </Tag>
            );
          })}
        </StyledTags>
        <div>
          <StyledUserInfo>{articleInfo.user ? articleInfo.user.username : null}</StyledUserInfo>
          <StyledDate>Создано {dateToDateDistance(articleInfo.date)} назад</StyledDate>
        </div>
      </StyledMeta>
    </StyledArticle>
  );
};

export default Article;

Article.defaultProps = {
  isPreview: false,
};

Article.propTypes = {
  isPreview: PropTypes.bool,
  articleInfo: PropTypes.shape({
    text: PropTypes.string,
    date: PropTypes.string,
    articleTags: PropTypes.array,
    id: PropTypes.number,
    title: PropTypes.string,
    user: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
};

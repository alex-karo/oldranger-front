import React from 'react';
import { Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import queries from '../../serverQueries';
import { Column } from '../Articles/styled';
import Article from '../Articles/Article';
import { StyledTitle } from '../Main/styled';

class SearchArticlesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      messageError: null,
      loading: true,
    };
  }

  componentDidMount() {
    const firstPage = 1;

    this.getArticles(firstPage)
      .then(data => {
        if (data.articleList) {
          this.setState({ articles: data.articleList, loading: false });
        } else {
          this.setState({ messageError: 'Нет результатов по запросу', loading: false });
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          this.setState({ messageError: error.response.data, loading: false });
        }
        this.setState({ loading: false });
      });
  }

  getArticles = async page => {
    const { match } = this.props;
    return queries.searchByArticles(match.params.searchRequest, page);
  };

  render() {
    const { articles, messageError, loading } = this.state;
    const {
      match: {
        params: { searchRequest },
      },
    } = this.props;

    if (loading) {
      return <Spin />;
    }

    return (
      <>
        <Column>
          {articles.length > 0
            ? articles.map(article => {
                return <Article key={article.id} articleInfo={article} isPreview />;
              })
            : messageError && (
                <StyledTitle>
                  {`${messageError} `}
                  <i>{searchRequest}</i>
                </StyledTitle>
              )}
        </Column>
      </>
    );
  }
}

SearchArticlesPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default withRouter(SearchArticlesPage);

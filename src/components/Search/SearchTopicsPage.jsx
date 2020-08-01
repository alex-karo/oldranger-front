import React from 'react';
import { Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import queries from '../../serverQueries';
import TopicsList from '../Subsection/TopicsList';
import TopicsListItem from '../Subsection/TopicsListItem';
import { StyledTitle } from '../Main/styled';

class SearchTopicsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      messageError: null,
      loading: true,
    };
  }

  componentDidMount() {
    const firstPage = 1;

    this.getTopics(firstPage)
      .then(data => {
        if (data) this.setState({ topics: data.topics, loading: false });
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          this.setState({ messageError: error.response.data, loading: false });
        }
        this.setState({ loading: false });
      });
  }

  getTopics = async page => {
    const { match } = this.props;
    return queries.searchByTopics(match.params.searchRequest, page);
  };

  render() {
    const { topics, messageError, loading } = this.state;
    const {
      match: {
        params: { searchRequest },
      },
    } = this.props;

    if (loading) {
      return <Spin />;
    }

    return topics.length > 0 ? (
      <TopicsList
        itemComponent={item => <TopicsListItem topicData={{ topic: item }} />}
        items={topics}
        title={`Результы поиска в темах по запросу ${searchRequest}`}
      />
    ) : (
      messageError && (
        <StyledTitle>
          {`${messageError} `}
          <i>{searchRequest}</i>
        </StyledTitle>
      )
    );
  }
}

SearchTopicsPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default withRouter(SearchTopicsPage);

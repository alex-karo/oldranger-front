import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types';
import queries from '../../serverQueries';
import TopicsList from './TopicsList';
import TopicsListItem from './TopicsListItem';
import SearchForm from '../Main/SearchForm';

class Subsection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      name: '',
      hasMore: true,
      page: 1,
      hasChildren: true,
    };
  }

  componentDidMount() {
    this.getTopic(0).then(topics => {
      const hasChildren = !(topics.length === 0);
      const topicName = topics[0] === undefined ? 'No Title' : topics[0].topic.subsection.name;
      this.setState({
        topics,
        name: topicName,
        hasChildren,
      });
    });
  }

  getTopic = page => {
    const { match } = this.props;
    return queries.getSubsectionTopics(match.params.subsectionId, page);
  };

  lazyLoadMore = () => {
    const { topics, page } = this.state;
    this.getTopic(page).then(data => {
      if (data.length === 0) {
        this.setState({ hasMore: false });
      } else {
        this.setState({ topics: [...topics, ...data], page: page + 1 });
      }
    });
  };

  render() {
    const { topics, name, hasMore, hasChildren, inProgress } = this.state;
    return (
      <>
        <SearchForm />
        {topics.length > 0 && (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Главная</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/section/${topics[0].topic.section.id}`}>
                {topics[0].topic.section.name}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/subsection/${topics[0].topic.subsection.id}`}>
                {topics[0].topic.subsection.name}
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
        <TopicsList
          fetchMessages={this.lazyLoadMore}
          hasMore={hasMore}
          inProgress={inProgress}
          hasChildren={hasChildren}
          items={topics}
          title={name}
          itemComponent={item => <TopicsListItem topicData={item} />}
        />
      </>
    );
  }
}

Subsection.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default withRouter(Subsection);

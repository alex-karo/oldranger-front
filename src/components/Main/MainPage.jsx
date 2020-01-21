import React from 'react';
import { Spin } from 'antd';
import SubSectionsList from './SubSectionsList';
import queries from '../../serverQueries';
import { StyledMainPage } from './styled';
import TopicsList from '../Subsection/TopicsList';
import TopicsListItem from '../Subsection/TopicsListItem';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rootSections: [],
      actualTopics: [],
    };
  }

  componentDidMount() {
    queries.getActualTopics().then(actualTopics => {
      this.setState({ actualTopics });
    });
    queries.getAllSections().then(sections => {
      this.setState({ rootSections: sections });
    });
  }

  render() {
    const { rootSections, actualTopics } = this.state;
    return (
      <StyledMainPage>
        {actualTopics.length > 0 ? (
          <TopicsList
            itemComponent={item => <TopicsListItem topicData={item} />}
            items={actualTopics}
            title="Актуальные темы"
          />
        ) : (
          <Spin />
        )}
        {rootSections.length > 0 ? (
          rootSections.map(section => (
            <SubSectionsList section={section} key={section.section.id} />
          ))
        ) : (
          <Spin />
        )}
      </StyledMainPage>
    );
  }
}

export default MainPage;

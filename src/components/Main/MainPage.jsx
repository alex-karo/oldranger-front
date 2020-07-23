import React from 'react';
import { Spin } from 'antd';
import SubSectionsList from './SubSectionsList';
import queries from '../../serverQueries';
import { StyledMainPage } from './styled';
import TopicsList from '../Subsection/TopicsList';
import TopicsListItem from '../Subsection/TopicsListItem';
import SearchForm from './SearchForm';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rootSections: [],
      actualTopics: [],
      errorOnLoading: false,
    };
  }

  componentDidMount() {
    queries
      .getActualTopics()
      .then(actualTopics => {
        this.setState({ actualTopics });
      })
      .catch(() => this.setState({ errorOnLoading: true }));
    queries.getAllSections().then(sections => {
      this.setState({ rootSections: sections });
    });
  }

  render() {
    const { rootSections, actualTopics, errorOnLoading } = this.state;

    const topics = (
      <>
        {actualTopics.length > 0 && rootSections.length > 0 ? (
          <>
            <TopicsList
              itemComponent={item => <TopicsListItem topicData={item} />}
              items={actualTopics}
              title="Актуальные темы"
            />
            {rootSections.map(section => (
              <SubSectionsList section={section} key={section.section.id} />
            ))}
          </>
        ) : (
          <Spin />
        )}
      </>
    );

    return (
      <StyledMainPage>
        <SearchForm />
        {errorOnLoading ? 'Не найдено ни одной темы' : topics}
      </StyledMainPage>
    );
  }
}

export default MainPage;

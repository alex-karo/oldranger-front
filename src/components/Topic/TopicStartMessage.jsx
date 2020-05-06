import React from 'react';
import { parseISO, format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link, useParams } from 'react-router-dom';
import PropTypesUser from './propTypes/userProps';
import UserAvatar from '../commons/UserAvatar';
import {
  TopicContainer,
  TopicHeaderWrapp,
  TopicHeaderTitle,
  TopicHeaderDate,
  TopicHeaderAuthorWrapp,
  TopicHeaderAuthorWrappCol,
  TopicHeaderAuthorNickName,
  TopicHeaderDefaultMessage,
} from './TopicHeaderStyled';

import Context from '../Context';

const TopicStartMessage = ({ topic }) => {
  const { topicId } = useParams();

  return (
    <Context.Consumer>
      {({ isLogin, user: { role } }) => (
        <TopicContainer>
          <TopicHeaderWrapp>
            <TopicHeaderTitle>
              {topic.name}
              {isLogin && role === 'ROLE_ADMIN' && (
                <Link
                  style={{
                    fontSize: '16px',
                    marginLeft: '6px',
                    color: '#24292e',
                    lineHeight: '40px',
                  }}
                  to={`/topic/${topicId}/update`}
                >
                  <Icon type="edit" theme="outlined" />
                </Link>
              )}
            </TopicHeaderTitle>

            <TopicHeaderAuthorWrapp>
              <TopicHeaderAuthorWrappCol>
                <UserAvatar
                  shape="square"
                  size={48}
                  icon="user"
                  src={topic.topicStarter.avatar.small}
                />
              </TopicHeaderAuthorWrappCol>
              <TopicHeaderAuthorWrappCol>
                <TopicHeaderAuthorNickName>{topic.topicStarter.nickName}</TopicHeaderAuthorNickName>
                <TopicHeaderDate>
                  {format(parseISO(topic.startTime), "dd MMMM yyyy 'в' HH:mm", {
                    locale: ru,
                  })}
                </TopicHeaderDate>
              </TopicHeaderAuthorWrappCol>
            </TopicHeaderAuthorWrapp>
          </TopicHeaderWrapp>
          <TopicHeaderDefaultMessage dangerouslySetInnerHTML={{ __html: topic.startMessage }} />
        </TopicContainer>
      )}
    </Context.Consumer>
  );
};

TopicStartMessage.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    messageCount: PropTypes.number,
    startTime: PropTypes.string,
    lastMessageTime: PropTypes.string,
    startMessage: PropTypes.string,
    topicStarter: PropTypesUser.isRequired,
  }).isRequired,
};

export default TopicStartMessage;

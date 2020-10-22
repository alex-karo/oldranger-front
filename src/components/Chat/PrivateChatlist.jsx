import React from 'react';
import { uniqueId } from 'lodash';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';
import {
  PrivateChatContainer,
  MessageContainer,
  Avatar,
  PrivateMessage,
  AvatarSection,
  MessageSection,
} from './styled';
import queries from '../../serverQueries';
import { BASE_URL as url } from '../../constants';
import testArray from './testData';

export default function PrivateChatlist() {
  // queries.getPrivateMessages();

  const renderChatItems = dialogues => {
    return dialogues.map(dialogue => {
      const { author, messageShort, unreadCount } = dialogue;
      const messageArray = messageShort.split('');
      let message = '';
      if (messageArray.length > 70) {
        messageArray.length = 70;
        message = `${messageArray.join('')}...`;
      } else {
        message = messageArray.join('');
      }

      return (
        <Link key={uniqueId('id_')} to="/profile/private/2">
          <MessageContainer>
            <AvatarSection>
              <Avatar src={`${url}img/default-sm.png`} alt="" style={{ width: '40px' }} />
            </AvatarSection>
            <MessageSection>
              <h3 style={{ margin: '0' }}>{author}</h3>
              <PrivateMessage>{message}</PrivateMessage>
            </MessageSection>
            {unreadCount > 0 ? (
              <Badge style={{ position: 'absolute' }} count={unreadCount} />
            ) : null}
          </MessageContainer>
        </Link>
      );
    });
  };

  return (
    <PrivateChatContainer>
      <button type="button" onClick={queries.getPrivateMessages}>
        запрос
      </button>
      {renderChatItems(testArray)}
    </PrivateChatContainer>
  );
}

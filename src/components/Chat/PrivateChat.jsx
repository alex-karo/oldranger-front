/* eslint-disable no-await-in-loop */
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { BASE_URL } from '../../constants';
import queries from '../../serverQueries';
import Chat from './Chat';

const url = BASE_URL;

class PrivateChat extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = { user, anotherUserId: null, anotherUserNick: '', messages: [], show: false };
  }

  componentDidMount = async () => {
    const { user } = this.state;
    const { match = {} } = this.props;
    const { id = null } = match.params;
    if (Number(user.id) === Number(id)) {
      return;
    }
    const anotherUser = await queries.getAnotherUserData(id);
    if (anotherUser) {
      const chatToken = await queries.getPersonalToken(anotherUser.userId, user);
      this.setState({
        chatToken,
        anotherUserId: anotherUser.userId,
        anotherUserNick: anotherUser.nickName,
        show: true,
      });
      this.connect(chatToken);
    }
  };

  componentWillUnmount = () => {
    const { anotherUserId } = this.state;
    if (anotherUserId) {
      this.disconnect();
    }
  };

  connect = async token => {
    const socket = new SockJS(`${url}ws`, null, {});
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = null;
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/channel/private/${token}`, this.onMessageRecieved, {});
      this.getMessages();
    });
  };

  disconnect = () => {
    const { chatToken } = this.state;
    const { history } = this.props;
    this.stompClient.unsubscribe(`/channel/private/${chatToken}`);
    this.stompClient.disconnect();
    history.push(`/`);
  };

  sendMessage = async (msg, file, replyTo = null) => {
    const { chatToken, user } = this.state;
    if (msg || file) {
      const message = {
        sender: user.nickName,
        text: msg,
        senderAvatar: user.avatar,
        replyTo,
        type: 'MESSAGE',
        ...file,
      };
      this.stompClient.send(`/chat/send/${chatToken}`, {}, JSON.stringify(message));
    }
  };

  getMessages = async (isFull = false) => {
    const { chatToken } = this.state;
    if (isFull) {
      let status = 200;
      let page = 0;
      let messages = [];
      while (status === 200) {
        const response = await queries.getPersonalMessage(chatToken, page);
        status = response.status;
        page += 1;
        messages = [...messages, ...response.data];
      }
      this.setState({ messages: messages.reverse() });
    } else {
      const { data } = await queries.getPersonalMessage(chatToken, 0);
      this.setState({ messages: data ? data.reverse() : [] });
    }
  };

  onMessageRecieved = payload => {
    const message = JSON.parse(payload.body);
    // fakeId - это костыль, чтобы избежать постоянного перерендера
    // т.к. уникального ключа для событий c type JOIN/LEAVE нет
    if (!message.id) {
      message.id = uniqueId('fakeId-');
    }
    this.setState(state => ({ messages: [...state.messages, message] }));
    setTimeout(() => {
      const lastMessage = document.querySelector('.message-list li:last-of-type');
      lastMessage.scrollIntoView();
    }, 200);
  };

  postFile = chatToken => async formData => queries.postFilePersonalChat(formData, chatToken);

  deleteCurrentMessage = async id => {
    const { messages } = this.state;
    queries.deletePrivateMessage(id);
    this.setState({ messages: messages.filter(msg => msg.id !== id) });
  };

  render() {
    const { messages, user, chatToken, anotherUserNick, show } = this.state;
    const {
      history: {
        location: { state },
      },
    } = this.props;
    if (!show) {
      return '';
    }
    return (
      <>
        <Chat
          chatState={state}
          handleDisconnect={this.disconnect}
          deleteCurrentMessage={this.deleteCurrentMessage}
          messages={messages}
          sendMessage={this.sendMessage}
          user={user}
          postFile={this.postFile(chatToken)}
          label={`Персональный чат с ${anotherUserNick}`}
          getMessages={this.getMessages}
        />
      </>
    );
  }
}

export default withRouter(PrivateChat);

PrivateChat.propTypes = {
  user: PropTypes.shape({
    nickName: PropTypes.string,
    avatar: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.string,
    }),
  }).isRequired,
};

PrivateChat.defaultProps = {
  user: null,
  match: { params: { id: null } },
};

/* eslint-disable no-await-in-loop */
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import Chat from './Chat';
import queries from '../../serverQueries';

class ChatAuth extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = { isJoin: false, user, usersOnline: {}, messages: [] };
  }

  componentWillUnmount = () => {
    const { changeJoinChat } = this.props;
    this.disconnect();
    changeJoinChat(false);
  };

  componentDidMount = async () => {
    const { changeJoinChat } = this.props;
    await this.connect();
    changeJoinChat(true);
  };

  connect = async () => {
    const isForb = await queries.isForbidden();
    if (isForb) {
      // banned user
    }
    this.onConnected();
  };

  disconnect = evt => {
    const { user } = this.state;
    const { history, stompClient } = this.props;
    stompClient.send(`chat/delUser`, {}, JSON.stringify({ sender: user.nickName, type: 'LEAVE' }));
    this.setState({ isJoin: false });
    if (evt) {
      history.push('/');
    }
  };

  onConnected = () => {
    this.setState({ isJoin: true });
    const { stompClient } = this.props;
    const { user } = this.state;
    this.getMessages();
    stompClient.subscribe('/channel/public', this.onMessageRecieved);
    stompClient.send('/chat/addUser', {}, JSON.stringify({ sender: user.nickName, type: 'JOIN' }));
  };

  getUsersOnline = async () => {
    const usersOnline = await queries.getAllUsers();
    this.setState({ usersOnline });
  };

  getMessages = async (isFull = false) => {
    if (isFull) {
      let status = 200;
      let page = 0;
      let messages = [];
      while (status === 200) {
        const response = await queries.getAllMessages(page);
        status = response.status;
        page += 1;
        messages = [...messages, ...response.data];
      }
      this.setState({ messages: messages.slice().reverse() });
    } else {
      const { data } = await queries.getAllMessages(0);
      this.setState({ messages: data ? data.slice().reverse() : [] });
    }
  };

  sendMessage = (msg, file, replyTo = null) => {
    const { stompClient } = this.props;
    if (msg || file) {
      const { user } = this.props;
      const message = {
        sender: user.nickName,
        text: msg,
        senderAvatar: user.avatar,
        replyTo,
        type: 'MESSAGE',
        ...file,
      };
      stompClient.send(`/chat/sendMessage`, {}, JSON.stringify(message));
    }
  };

  onMessageRecieved = payload => {
    const message = JSON.parse(payload.body);
    // fakeId - это костыль, чтобы избежать постоянного перерендера
    // т.к. уникального ключа для событий c type JOIN/LEAVE нет
    if (!message.id) {
      message.id = uniqueId('fakeId-');
    }

    this.setState(state => ({
      messages: [...state.messages, message],
    }));
    this.getUsersOnline();
    const lastMessage = document.querySelector('.message-list li:last-of-type');
    if (lastMessage) {
      lastMessage.scrollIntoView();
    }
  };

  deleteCurrentMessage = async id => {
    const { messages } = this.state;
    queries.deleteMessage(id);
    this.setState({ messages: messages.filter(msg => msg.id !== id) });
  };

  render() {
    const { isJoin, messages, usersOnline } = this.state;
    const { user } = this.props;
    return isJoin ? (
      <Chat
        handleDisconnect={this.disconnect}
        deleteCurrentMessage={this.deleteCurrentMessage}
        usersOnline={usersOnline}
        messages={messages}
        sendMessage={this.sendMessage}
        user={user}
        getMessages={this.getMessages}
        postFile={queries.postFile}
        label="Общий чат"
      />
    ) : (
      <Spin />
    );
  }
}

export default withRouter(ChatAuth);

ChatAuth.propTypes = {
  user: PropTypes.shape({
    nickName: PropTypes.string,
    avatar: PropTypes.string,
  }),
  stompClient: PropTypes.objectOf().isRequired,
  history: PropTypes.objectOf(PropTypes.func).isRequired,
  changeJoinChat: PropTypes.func.isRequired,
};

ChatAuth.defaultProps = {
  user: null,
};

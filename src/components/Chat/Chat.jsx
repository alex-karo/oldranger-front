import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { throttle } from 'lodash';

import { Input, Button, message as systemMessage, Icon, Tooltip } from 'antd';
import { withRouter } from 'react-router-dom';
import { BASE_URL } from '../../constants';
import Context from '../Context';
import {
  ChatContainer,
  Header,
  Main,
  UserListTitle,
  OnlineLED,
  UserList,
  User,
  UserLink,
  MessageList,
  Message,
  EventMessage,
  MessageAvatar,
  MessageAuthor,
  MessageImage,
  MessageDate,
  MessageText,
  MessageInner,
  ScrollToTopButton,
  Arrow,
  Form,
  Footer,
  MinimizeButton,
  StyledBadge,
  WrapperSelect,
  Title,
} from './styled';

const url = BASE_URL;
const timeMessage = [
  { value: '30', label: '30 минут' },
  { value: '60', label: '1 час' },
  { value: '120', label: '2 часа' },
  { value: '360', label: '6 часов' },
  { value: '1440', label: '1 день' },
  { value: '2880', label: '2 дня' },
  { value: '10080', label: '1 неделя' },
];

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      file: null,
      filePath: '',
      replyTo: null,
      hasScrolled: false,
      minimizeChat: true,
      select: timeMessage,
    };
  }

  componentDidMount() {
    this.trottledFunction = throttle(this.onScroll, 150);
    this.scrollingWrapper.addEventListener('scroll', this.trottledFunction);
  }

  componentDidUpdate(prevProps) {
    const { changeJoinChat, chatState } = this.props;
    const { minimizeChat } = this.state;
    if (chatState !== prevProps.chatState && minimizeChat) {
      changeJoinChat(false);
    }
  }

  componentWillUnmount() {
    this.scrollingWrapper.removeEventListener('scroll', this.trottledFunction);
  }

  handleChangeMessage = event => {
    this.setState({ message: event.target.value });
  };

  handleChangeFile = async event => {
    const { size } = event.target.files[0];
    if (size / 1024 / 1024 > 20) {
      systemMessage.error('Отправляемый файл не может быть больше 20 Мб');
      return;
    }
    this.setState({ filePath: event.target.value });
  };

  uploadFile = async () => {
    const { filePath } = this.state;
    const { postFile } = this.props;
    if (!filePath) return;
    const form = document.querySelector('.message-form');
    const formData = new FormData(form);
    const file = await postFile(formData);
    this.setState({ file });
  };

  handleChangeTimeMessage = value => {
    return value;
  };

  resetForm = () => {
    this.setState({ message: '', file: null, filePath: '', disabled: false });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ disabled: true });
    await this.uploadFile();
    const { sendMessage } = this.props;
    const { message, file, replyTo } = this.state;
    sendMessage(message, file, replyTo);
    this.resetForm();
  };

  handleShowFull = () => {
    const { getMessages } = this.props;
    getMessages(true);
    this.scrollingWrapper.scrollTop = 0;
  };

  wrapLink = text => {
    const reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const textSplitOfLinks = text.split(reg);
    const result = textSplitOfLinks.map((el, index) =>
      index % 2 === 0 ? (
        el
      ) : (
        <a href={el} target="_blank" rel="noopener noreferrer">
          {el}
        </a>
      )
    );
    return result;
  };

  drawMessage = msg => {
    const { user, deleteCurrentMessage } = this.props;
    const isSender = user.nickName === msg.sender;
    if (msg.type === 'MESSAGE') {
      const urlAvatar = msg.senderAvatar === null ? 'default-sm.png' : msg.senderAvatar;
      return (
        <Message toMe={user.nickName === msg.replyTo} key={msg.id}>
          <MessageAvatar
            alt="avatar"
            src={`${url}img/${urlAvatar}`}
            onClick={() => this.setState({ replyTo: msg.sender, message: `${msg.sender}, ` })}
          />
          <div>
            <MessageAuthor>{msg.sender}</MessageAuthor>
            {msg.originalImg ? (
              <a
                rel="noopener noreferrer"
                href={`${url}img/chat/${msg.originalImg}`}
                target="_blank"
              >
                <MessageImage
                  alt="picture"
                  className="message-image"
                  src={`${url}img/chat/${msg.thumbnailImg}`}
                />
              </a>
            ) : (
              ''
            )}
            {msg.filePath ? (
              <div>
                <a href={`${url}img/chat/${msg.filePath}`} download>
                  {msg.fileName}
                </a>
              </div>
            ) : (
              ''
            )}
            <MessageText className="message-text">{this.wrapLink(msg.text)}</MessageText>
          </div>
          <MessageInner>
            {isSender ? (
              <Tooltip placement="topRight" title="Удалить">
                <button
                  type="button"
                  className="message-delete"
                  onClick={() => deleteCurrentMessage(msg.id)}
                >
                  <Icon type="delete" theme="twoTone" />
                </button>
              </Tooltip>
            ) : null}
            <MessageDate className="message-date">{msg.messageDate}</MessageDate>
          </MessageInner>
        </Message>
      );
    }
    return (
      <EventMessage className="event-message" key={msg.id}>
        {`${msg.sender} ${msg.type === 'LEAVE' ? 'покинул чат' : 'присоединился'}`}
      </EventMessage>
    );
  };

  onScroll = () => {
    const { hasScrolled } = this.state;
    if (this.scrollingWrapper.scrollTop > 100 && !hasScrolled) {
      this.setState({ hasScrolled: true });
    } else if (this.scrollingWrapper.scrollTop < 100 && hasScrolled) {
      this.setState({ hasScrolled: false });
    }
  };

  handleMinimizeChat = changeJoinChat => () => {
    const { minimizeChat } = this.state;
    this.setState(
      state => ({
        minimizeChat: !state.minimizeChat,
      }),
      () => {
        changeJoinChat(minimizeChat);
      }
    );
  };

  reference = id => ref => {
    this[id] = ref;
  };

  render() {
    const { messages, usersOnline, label, chatState } = this.props;
    const fixedChat = chatState !== 'mainChat' && chatState !== 'privateChat';
    const { message, filePath, hasScrolled, minimizeChat, select, disabled } = this.state;
    return (
      <Context.Consumer>
        {({ user, countMessages, changeJoinChat }) => {
          return (
            <section>
              <ChatContainer fixedChat={fixedChat}>
                <Header>
                  <Title>
                    {label}
                    {fixedChat ? <StyledBadge count={countMessages} /> : null}
                  </Title>
                  {fixedChat ? (
                    <MinimizeButton onClick={this.handleMinimizeChat(changeJoinChat)} />
                  ) : null}
                </Header>
                <Main minimizeChat={minimizeChat} fixedChat={fixedChat}>
                  <div style={{ width: '20%' }}>
                    {user.role === 'ROLE_ADMIN' && (
                      <WrapperSelect>
                        <p>Время хранения сообщений</p>
                        <Select
                          options={select}
                          defaultValue={select[1]}
                          onChange={this.handleChangeTimeMessage}
                        />
                      </WrapperSelect>
                    )}
                    <OnlineLED />
                    <UserListTitle>Online:</UserListTitle>
                    <UserList fixedChat={fixedChat}>
                      {Object.entries(usersOnline).map(userOn => {
                        const [username, id] = userOn;
                        return (
                          <User key={userOn}>
                            <UserLink href={`/anotheruser/${id}`}>{username}</UserLink>
                          </User>
                        );
                      })}
                    </UserList>
                  </div>
                  <div style={{ width: '80%', postion: 'relative' }}>
                    <MessageList className="message-list" ref={this.reference('scrollingWrapper')}>
                      {hasScrolled && (
                        <ScrollToTopButton onClick={this.handleShowFull}>
                          <Arrow />
                        </ScrollToTopButton>
                      )}
                      {messages.map(msg => this.drawMessage(msg))}
                    </MessageList>
                  </div>
                </Main>
                <Form
                  minimizeChat={minimizeChat}
                  fixedChat={fixedChat}
                  className="message-form"
                  onSubmit={this.handleSubmit}
                >
                  <Input
                    type="text"
                    placeholder="Введите сообщение..."
                    className="message-input"
                    value={message}
                    onChange={this.handleChangeMessage}
                  />
                  <Footer>
                    <input
                      type="file"
                      onChange={this.handleChangeFile}
                      value={filePath}
                      name="file-input"
                    />
                    <Button
                      type="primary"
                      disabled={disabled}
                      className="send-button"
                      htmlType="submit"
                    >
                      Отправить
                    </Button>
                  </Footer>
                </Form>
              </ChatContainer>
            </section>
          );
        }}
      </Context.Consumer>
    );
  }
}

export default withRouter(Chat);

Chat.propTypes = {
  changeJoinChat: PropTypes.func.isRequired,
  chatState: PropTypes.string.isRequired,
  sendMessage: PropTypes.func.isRequired,
  deleteCurrentMessage: PropTypes.func.isRequired,
  getMessages: PropTypes.func.isRequired,
  user: PropTypes.shape({
    nickName: PropTypes.string,
  }),
  usersOnline: PropTypes.shape({}),
  messages: PropTypes.arrayOf(PropTypes.object),
  postFile: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

Chat.defaultProps = {
  user: null,
  usersOnline: {},
  messages: [],
};

import styled, { keyframes } from 'styled-components';

const Ul = styled.ul`
  list-style: none;
  margin: 0;
  overflow: auto;
  overflow-y: scroll;
  padding: 0 20px 0 20px;
  height: 100%;
  width: 80%;
  border-left: 1px solid #e8e8e8;
`;

const Li = styled.li`
  line-height: 1.5rem;
  padding: 10px 20px;
  margin: 0;
  border-bottom: 1px solid #f4f4f4;
`;

export const GreetingContainer = styled.div`
  text-align: center;
  padding: 20px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 1px 11px rgba(0, 0, 0, 0.27);
  border-radius: 2px;
  max-width: 500px;
`;

export const ChatContainer = styled.div`
  max-width: 700px;
  margin: 30px auto 0;
  background-color: #fff;
  box-shadow: 0 1px 11px rgba(0, 0, 0, 0.27);
  height: calc(100% - 60px);
  max-height: 700px;
  position: relative;
  border-radius: 10px;
`;

export const Header = styled.header`
  text-align: center;
  padding: 15px;
  padding-bottom: 0;
  border-bottom: 1px solid #e8e8e8;
`;

export const CloseButton = styled.button`
  position: absolute;
  background: none;
  border: none;
  right: 20px;
  top: 15px;
  width: 32px;
  height: 32px;
  opacity: 0.3;
  outline: none;
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
  &:before,
  &:after {
    position: absolute;
    left: 15px;
    top: 0;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #333;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;

export const Main = styled.div`
  display: flex;
  height: 350px;
`;

export const UserListTitle = styled.h3`
  margin: 20px 0 20px 5px;
  font-weight: 300;
  display: inline-block;
`;

const pulse = keyframes`
25% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

export const OnlineLED = styled.span`
  background: #28b62c;
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-bottom: 2px;
  margin-left: 20px;
  border-radius: 50%;
  animation: ${pulse} 2s infinite linear;
`;

export const UserList = styled(Ul)`
  border: none;
  height: 80%;
  width: 100%;
`;

export const User = styled(Li)`
  border: none;
  padding: 5px;
`;

export const UserLink = styled.a`
  color: #333;
  &:hover {
    color: #128ff2;
  }
`;

export const MessageList = styled(Ul)`
  width: 100%;
`;

export const Message = styled(Li)`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 10px 20px 10px 68px;
  color: black;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${props => (props.toMe ? '#128ff2' : '#f4f4f4')};
`;

export const EventMessage = styled(Li)`
  text-align: center;
`;

export const MessageAvatar = styled.img`
  position: absolute;
  width: 42px;
  height: 42px;
  left: 10px;
  top: 10px;
  border: 1px solid #128ff2;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
`;

export const MessageAuthor = styled.div`
  font-weight: 700;
  font-size: 1rem;
`;

export const MessageImage = styled.img`
  margin: 10px 0;
  max-height: 250px;
`;

export const MessageDate = styled.span`
  color: #888888;
  font-size: 10px;
`;

export const MessageText = styled.p`
  margin: 0;
`;

export const MessageInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;

  .message-delete {
    cursor: pointer;
    padding: none;
    background: inherit;
    border: none;
  }
`;

export const ShowFullButton = styled.button`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: #fff;
  border: 1px solid #128ff2;
  margin: 20px auto;
  margin-left: calc(50% - 20px);
  cursor: pointer;
`;

export const Arrow = styled.span`
  border: solid #128ff2;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-135deg);
`;

export const Form = styled.form`
  padding: 20px;
`;

export const Footer = styled.footer`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

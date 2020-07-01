import styled, { keyframes } from 'styled-components';

const Ul = styled.ul`
  list-style: none;
  margin: 0;
  overflow: auto;
  overflow-y: scroll;
  padding: 0 20px 0 20px;
  width: 80%;
  border-left: 1px solid #e8e8e8;
`;

const Li = styled.li`
  line-height: 1.5rem;
  padding: 10px 20px;
  margin: 0;
  border-bottom: 1px solid #f4f4f4;
`;

export const ChatContainer = styled.div`
  width: ${({ state }) => (state !== 'mainChat' && state !== 'privateChat' ? '550px' : '100%')};
  display: block;
  margin: 10px auto 20px;
  background-color: #fff;
  box-shadow: 0 1px 11px rgba(0, 0, 0, 0.27);
  height: ${({ state }) => (state !== 'mainChat' && state !== 'privateChat' ? 'auto' : '100%')};
  position: ${({ state }) =>
    state !== 'mainChat' && state !== 'privateChat' ? 'fixed' : 'relative'};
  bottom: ${({ state }) => (state !== 'mainChat' && state !== 'privateChat' ? '0' : 'none')};
  right: ${({ state }) => (state !== 'mainChat' && state !== 'privateChat' ? '0' : 'none')};
  border-radius: 10px;
  @media (max-width: 2200px) {
    display: ${({ state }) => (state !== 'mainChat' && state !== 'privateChat' ? 'none' : 'block')};
  }
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
  height: ${({ state }) => (state !== 'mainChat' && state !== 'privateChat' ? '300px' : '400px')};
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
  height: ${({ state }) => (state !== 'mainChat' && state !== 'privateChat' ? '300px' : '350px')};
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
  padding: 0;
  width: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  scroll-behavior: smooth;
`;

export const Message = styled(Li)`
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 10px 0 0 45px;
  color: black;
  line-height: 1rem;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${props => (props.toMe ? '#128ff2' : '#f4f4f4')};
`;

export const EventMessage = styled(Li)`
  text-align: center;
`;

export const MessageAvatar = styled.img`
  position: absolute;
  width: 28px;
  height: 28px;
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
  font-size: 0.8rem;
`;

export const MessageImage = styled.img`
  margin: 0 0;
  max-height: 250px;
`;

export const MessageDate = styled.span`
  width: 80px;
  color: #888888;
  font-size: 10px;
`;

export const MessageText = styled.p`
  margin: 5px 0;
  word-break: break-all;
`;

export const MessageInner = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  .message-delete {
    cursor: pointer;
    padding: none;
    background: inherit;
    border: none;
  }
`;

export const ScrollToTopButton = styled.button`
  position: absolute;
  top: 80px;
  left: 50%;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background-color: #fff;
  border: 1px solid #128ff2;
  cursor: pointer;
  z-index: 2;
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

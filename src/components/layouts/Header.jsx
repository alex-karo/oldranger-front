import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Badge } from 'antd';
import logo from '../../media/img/logo.png';

import Context from '../Context';

const StyledHeader = styled.div`
  padding-top: 10px;
  padding-bottom: 20px;
`;

const WrapLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledBadge = styled(Badge)`
  display: none;
  @media (max-width: 2200px) {
    display: ${({ state }) => (state === 'mainChat' ? 'none' : 'block')};
  }
`;

const Logo = styled.img`
  width: 110px;
  height: 95px;
`;

const LogoText = styled.h1`
  font-family: 'MusorC';
  font-weight: normal;
  font-size: 28px;
  margin: 0;
`;

const Menu = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .ant-badge {
    position: absolute;
    right: -10px;
    top: -5px;
  }
`;
const MenuMain = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .ant-btn {
    margin-right: 4%;
  }
`;

const MenuUser = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const MenuUserFirstRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 4%;
`;

const Header = ({ countMessages, location: { pathname } }) => {
  const [isForumHeader, setHeaderState] = useState(pathname === '/');

  const history = useHistory();
  const switchForumSitePart = bool => {
    setHeaderState(bool);
  };

  return (
    <Context.Consumer>
      {({ isLogin, logOut, user, muteChat, state, changeJoinChat }) => (
        <StyledHeader>
          <WrapLogo>
            <Logo src={logo} alt='Клуб "Старый следопыт"' />
            <LogoText>Клуб &quot;Старый следопыт&quot;</LogoText>
          </WrapLogo>
          <Menu>
            <MenuMain>
              {isForumHeader ? (
                <Button type="primary">
                  <Link to="/">Главная</Link>
                </Button>
              ) : (
                <Button type="primary" onClick={() => switchForumSitePart(true)}>
                  <Link to="/">Форум</Link>
                </Button>
              )}
              {isLogin && (
                <>
                  <Button onClick={() => changeJoinChat(true)} disabled={muteChat} type="primary">
                    <Link
                      to={{
                        pathname: '/chat',
                        state: 'mainChat',
                      }}
                    >
                      Чат
                      <StyledBadge state={state} count={countMessages} />
                    </Link>
                  </Button>
                  <Button type="primary">
                    <Link to="/profile/private">
                      {/* {здесь должна быть функция считающая личные сообщения} */}
                      Личные сообщения <Badge count="1" />
                    </Link>
                  </Button>
                  {isForumHeader ? (
                    <Button type="primary" onClick={() => switchForumSitePart(false)}>
                      <Link to="/articles">Сайт</Link>
                    </Button>
                  ) : (
                    <>
                      <Button>
                        <Link to="/articles">Статьи</Link>
                      </Button>
                      <Button>
                        <Link to="/albums">Альбомы</Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </MenuMain>
            <MenuUser>
              <MenuUserFirstRow>
                {isLogin ? (
                  <>
                    <Button>
                      <Link to="/profile">Профиль</Link>
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => {
                        logOut(history);
                      }}
                    >
                      Выйти
                    </Button>
                  </>
                ) : (
                  <Button type="link">
                    <Link to="/login">Войти</Link>
                  </Button>
                )}
              </MenuUserFirstRow>
              {isLogin && user.role === 'ROLE_ADMIN' && (
                <Button style={{ marginLeft: '0' }}>
                  <Link to="/admin-panel">Панель администратора</Link>
                </Button>
              )}
              {isLogin || (
                <Button>
                  <Link to="/request-invite">Запросить регистрацию</Link>
                </Button>
              )}
            </MenuUser>
          </Menu>
        </StyledHeader>
      )}
    </Context.Consumer>
  );
};

Header.defaultProps = {
  countMessages: 0,
};

Header.propTypes = {
  countMessages: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Header);

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
  flex-wrap: wrap;
  justify-content: center;

  .ant-btn {
    margin-right: 8%;
  }

  .ant-badge {
    position: absolute;
    right: -10px;
    top: -5px;
  }
`;

const Header = ({ countMessages }) => {
  return (
    <Context.Consumer>
      {({ isLogin, logOut, user, muteChat }) => (
        <StyledHeader>
          <WrapLogo>
            <Logo src={logo} alt='Клуб "Старый следопыт"' />
            <LogoText>Клуб &quot;Старый следопыт&quot;</LogoText>
          </WrapLogo>
          <Menu>
            <Button type="primary">
              <Link to="/">Главная</Link>
            </Button>
            {isLogin && (
              <>
                <Button disabled={muteChat} type="primary">
                  <Link to="/chat">
                    Чат
                    <Badge count={countMessages} />
                  </Link>
                </Button>
                <Button>
                  <Link to="/articles">Статьи</Link>
                </Button>
              </>
            )}
            {isLogin && user.role === 'ROLE_ADMIN' && (
              <Button style={{ marginLeft: '0' }}>
                <Link to="/admin-panel">Панель администратора</Link>
              </Button>
            )}
            {isLogin ? (
              <>
                <Button>
                  <Link to="/profile">Профиль</Link>
                </Button>
                <Button type="danger" onClick={logOut}>
                  Выйти
                </Button>
              </>
            ) : (
              <Button type="link">
                <Link to="/login">Войти</Link>
              </Button>
            )}
            {isLogin || (
              <Button type="primary">
                <Link to="/request-invite">Запросить регистрацию</Link>
              </Button>
            )}
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
};

export default Header;

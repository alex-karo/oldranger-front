import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon, Modal, Button, message } from 'antd';
import context from '../Context';
import { convertTimeToMilliseconds } from '../../utils';
import serverQueries from '../../serverQueries';

const AdminMenu = ({ user, updateUser }) => {
  const {
    isLogin,
    user: { role },
  } = useContext(context);

  if (!isLogin || role !== 'ROLE_ADMIN') {
    return null;
  }

  const handleMut = (dt, mutType) => () =>
    serverQueries
      .prohibitionWrite(user.id, mutType, Date.now() + dt)
      .then(({ dateUnblock }) => {
        const accountNonLocked = dateUnblock === null;
        updateUser({ ...user, accountNonLocked });
      })
      .catch(() => message.error('Похоже, что-то не так. Замутить не удалось.'));

  const handleBan = dt => () =>
    serverQueries
      .blackListRequest(user.id, Date.now() + dt)
      .then(({ dateUnblock }) => {
        const accountNonLocked = dateUnblock === null;
        updateUser({ ...user, accountNonLocked });
      })
      .catch(() => message.error('Похоже, что-то не так. Заблокировать не удалось.'));

  const handleUnban = () => {
    serverQueries
      .unblockUser(user.id)
      .then(({ dateUnblock }) => {
        const accountNonLocked = dateUnblock === null;
        updateUser({ ...user, accountNonLocked });
      })
      .catch(() => message.error('Похоже, что-то не так. Разблокировать не удалось.'));
  };

  const handleUnmute = () => {
    serverQueries
      .unmuteUser(user.id)
      .then(({ dateUnblock }) => {
        const accountNonLocked = dateUnblock === null;
        updateUser({ ...user, accountNonLocked });
      })
      .catch(() => message.error('Похоже, что-то не так. Разблокировать не удалось.'));
  };

  const openConfirm = (action, content) => () => {
    Modal.confirm({
      title: 'Confirmation',
      content: (
        <div>
          Вы хотите подтвердить действие: <b>{content}</b> для пользователя: <b>{user.nickName}</b>
        </div>
      ),
      onOk: action,
    });
  };

  const menu = (
    <Menu>
      <Menu.SubMenu title="Бан">
        <Menu.Item onClick={openConfirm(handleBan(convertTimeToMilliseconds()), 'бан на 24 часа')}>
          бан на 24 часа
        </Menu.Item>
        <Menu.Item onClick={openConfirm(handleBan(convertTimeToMilliseconds(7)), 'бан на 7 дней')}>
          бан на 7 дней
        </Menu.Item>
        <Menu.Item
          onClick={openConfirm(handleBan(convertTimeToMilliseconds(9999)), 'перманентный бан')}
        >
          перманентный бан
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu title="Запрет">
        <Menu.SubMenu title="Запрет чата">
          <Menu.Item
            onClick={openConfirm(
              handleMut(convertTimeToMilliseconds(), 'ON_CHAT'),
              'запрет на 24 часа'
            )}
          >
            запрет на 24 часа
          </Menu.Item>
          <Menu.Item
            onClick={openConfirm(
              handleMut(convertTimeToMilliseconds(7), 'ON_CHAT'),
              'запрет на 7 дней'
            )}
          >
            запрет на 7 дней
          </Menu.Item>
          <Menu.Item
            onClick={openConfirm(
              handleMut(convertTimeToMilliseconds(9999), 'ON_CHAT'),
              'пермаментный запрет чата'
            )}
          >
            пермаментный запрет чата
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu title="Запрет на комментирование">
          <Menu.Item
            onClick={openConfirm(
              handleMut(convertTimeToMilliseconds(), 'ON_COMMENTS'),
              'запрет на 24 часа'
            )}
          >
            запрет на 24 часа
          </Menu.Item>
          <Menu.Item
            onClick={openConfirm(
              handleMut(convertTimeToMilliseconds(7), 'ON_COMMENTS'),
              'запрет на 7 дней'
            )}
          >
            запрет на 7 дней
          </Menu.Item>
          <Menu.Item
            onClick={openConfirm(
              handleMut(convertTimeToMilliseconds(9999), 'ON_COMMENTS'),
              'пермаментный запрет'
            )}
          >
            пермаментный запрет
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu title="Запрет на создание тем">
          <Menu.Item
            onClick={openConfirm(
              handleMut(convertTimeToMilliseconds(), 'ON_FORUM_MESS'),
              'запрет на 24 часа'
            )}
          >
            запрет на 24 часа
          </Menu.Item>
          <Menu.Item
            onClick={openConfirm(
              handleMut(convertTimeToMilliseconds(7), 'ON_FORUM_MESS'),
              'запрет на 7 дней'
            )}
          >
            запрет на 7 дней
          </Menu.Item>
          <Menu.Item
            onClick={openConfirm(
              handleMut(convertTimeToMilliseconds(9999), 'ON_FORUM_MESS'),
              'пермаментный запрет'
            )}
          >
            пермаментный запрет
          </Menu.Item>
        </Menu.SubMenu>
      </Menu.SubMenu>
    </Menu>
  );

  return user.accountNonLocked ? (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button className="ant-dropdown-link">
        Доп. действия
        <Icon type="down" />
      </Button>
    </Dropdown>
  ) : (
    <>
      <Button onClick={openConfirm(handleUnban, 'unban')}>Разблокировать</Button>
      <Button onClick={openConfirm(handleUnmute, 'unmute')}>Размутить</Button>
    </>
  );
};

AdminMenu.propTypes = {
  user: PropTypes.instanceOf(Object).isRequired,
  updateUser: PropTypes.func,
};

AdminMenu.defaultProps = {
  updateUser: () => {},
};

export default AdminMenu;

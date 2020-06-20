import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon, Modal, Button, message } from 'antd';
import context from '../Context';
import serverQueries from '../../serverQueries';

const AdminMenu = ({ user, updateUser }) => {
  const {
    isLogin,
    user: { role },
  } = useContext(context);

  if (!isLogin || role !== 'ROLE_ADMIN') {
    return null;
  }

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

  const oneHour = 60 * 60 * 1000;

  const menu = (
    <Menu>
      <Menu.Item onClick={openConfirm(handleBan(24 * oneHour), 'бан на 24 часа')}>
        бан на 24 часа
      </Menu.Item>
      <Menu.Item onClick={openConfirm(handleBan(7 * 24 * oneHour), 'бан на 7 дней')}>
        бан на 7 дней
      </Menu.Item>
      <Menu.Item onClick={openConfirm(handleBan(9999 * 24 * oneHour), 'перманентный бан')}>
        перманентный бан
      </Menu.Item>
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
    <Button onClick={openConfirm(handleUnban, 'unban')}>Разблокировать</Button>
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

import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import serverQueries from '../../serverQueries';
import AdminMenu from '../AdminMenu';
import InvitedUsersTree from './InvitedUsersTree';

const UserInfoBlock = styled.div`
  padding: 20px;
  font-size: 24px;
`;

const Clear = styled.span`
  color: green;
`;

const Banned = styled.span`
  color: red;
`;

const UserInfo = () => {
  const [user, setUser] = useState({});
  const [tree, setTree] = useState([]);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    serverQueries.getUsersTree(id, 5).then(setTree);
    serverQueries.getUserById(id).then(setUser);
  }, [id]);

  const { nickName, accountNonLocked } = user;

  return (
    <div>
      <Button type="primary" onClick={() => history.go(-1)}>
        Назад
      </Button>
      <UserInfoBlock>
        <p>
          Никнейм: <b>{nickName}</b>
        </p>
        <p>
          Статус бана: {accountNonLocked ? <Clear>Отсутствует</Clear> : <Banned>Забанен</Banned>}
        </p>
        <AdminMenu user={user} updateUser={setUser} />
        <InvitedUsersTree treeData={tree} />
      </UserInfoBlock>
    </div>
  );
};

export default UserInfo;

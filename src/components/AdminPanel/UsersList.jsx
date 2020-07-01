import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import serverQueries from '../../serverQueries';
import { dateToDateDistance } from '../../utils';
import LinkToUserPage from './LinkToUserPage';
import UserBanStatus from './UserBanStatus';

const UsersList = () => {
  const [usersList, setUsersList] = useState([]);
  const [pageParams, setPageParams] = useState({ total: 0, pageSize: 5, currentPage: 0 });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    serverQueries.getUsersList(0).then(({ users, usersCount }) => {
      setUsersList(users);
      setPageParams({ total: usersCount });
    });
  }, []);

  const fetch = (params = {}) => {
    setLoading(true);
    const queryParamsList = [];
    const { ban, sortOrder, sortField, current } = params;
    const isFilteredBanned = ban === undefined ? false : ban.length !== 0;
    if (isFilteredBanned) {
      queryParamsList.push('banned');
    }

    if (sortOrder) {
      queryParamsList.push(sortField);
    }

    serverQueries.getFilteredUsers(current - 1, queryParamsList).then(({ users, usersCount }) => {
      setUsersList(users);
      setPageParams({ total: usersCount });
    });
    setLoading(false);
    setPageParams({ currentPage: current });
  };

  const handlepageChange = ({ current }, filters, sorter) => {
    fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      current,
      ...filters,
    });
  };

  const columns = [
    {
      title: 'Бан',
      dataIndex: 'ban',
      key: 'ban',
      render: (text, { userStatisticId }) => <UserBanStatus id={userStatisticId} />,
      filters: [{ text: 'Только забаненные', value: true }],
      onFilter: value => value,
    },
    {
      title: 'Никнейм',
      dataIndex: 'name',
      key: 'name',
      render: (text, { userStatisticId }) => <LinkToUserPage id={userStatisticId} />,
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Зарегистрирован',
      dataIndex: 'registered',
      render: dt => dateToDateDistance(dt),
    },
    {
      title: 'Последний визит',
      dataIndex: 'lastVizit',
      render: dt => dateToDateDistance(dt),
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      render: roleName =>
        roleName
          .split('ROLE_')
          .join('')
          .toLowerCase(),
    },
  ];

  return (
    <Table
      rowKey="email"
      columns={columns}
      dataSource={usersList}
      pagination={pageParams}
      onChange={handlepageChange}
      sortDirections={['descend']}
      loading={isLoading}
    />
  );
};

export default UsersList;

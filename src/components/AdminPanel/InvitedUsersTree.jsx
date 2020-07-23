import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Tree, Icon } from 'antd';

const InvitedUsersBlock = styled.div`
  display: flex;
  align-items: top;
`;

const InvitedUsersTree = ({ treeData }) => {
  const currentElem = treeData.find(item => item.deepTree === 0) || {};
  const { userParentId = null } = currentElem;

  const constructTree = (data, parentId) => {
    return data
      .filter(item => item.userParentId === parentId)
      .map(item => ({
        ...item,
        key: item.userId,
        title: item.nickName,
        icon: <Icon type="user" />,
        children: constructTree(data, item.userId),
      }));
  };

  return (
    treeData.length > 1 && (
      <InvitedUsersBlock>
        <span>Дерево приглашённых пользователей:</span>
        <Tree
          style={{ display: 'inline-block' }}
          showIcon
          treeData={constructTree(treeData, userParentId)}
        />
      </InvitedUsersBlock>
    )
  );
};

InvitedUsersTree.propTypes = {
  treeData: PropTypes.instanceOf(Array).isRequired,
};

export default InvitedUsersTree;

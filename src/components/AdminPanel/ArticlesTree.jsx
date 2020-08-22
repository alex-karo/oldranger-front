import React, { useEffect, useState } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import styled from 'styled-components';
import TagsModal from '../forms/Modal';
import { getFlatDataFromTree } from '../../utils';

const EditIcon = ({ onClick }) => (
  <WrapperIcon>
    <Icon
      type="edit"
      theme="outlined"
      onClick={onClick}
      style={{ marginLeft: '5px', marginRight: '5px' }}
    />
  </WrapperIcon>
);

EditIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const DeleteIcon = ({ onClick }) => (
  <WrapperIcon>
    <Icon type="delete" disabled="true" theme="outlined" onClick={onClick} />
  </WrapperIcon>
);

DeleteIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const ArticlesTree = props => {
  const {
    dataTags,
    eventType,
    changeActiveTags,
    updateTagAll,
    delTag,
    editTagsId,
    handleTagsSubmit,
    handleCancel,
    visible,
  } = props;

  const [tree, setTree] = useState(dataTags);
  const [disabled, setDisabled] = useState(true);
  const blankTag = { id: -1, position: 1, parentId: -1 };

  const transformTree = () => {
    setTree(dataTags);
  };

  useEffect(() => {
    transformTree();
  }, [dataTags]);

  const handleTreeUpdate = async () => {
    const data = await getFlatDataFromTree(tree);
    updateTagAll(data);
    setDisabled(true);
  };

  const handlechange = data => {
    setDisabled(false);
    setTree(data);
  };

  return (
    <div style={{ height: 400 }}>
      <SortableTree
        treeData={tree}
        getNodeKey={({ node }) => node.id}
        onChange={data => handlechange(data)}
        generateNodeProps={({ node }) => ({
          title: (
            <TagsContainer>
              <TagsLabel>
                <span>{node.title}</span>
                <EditIcon onClick={changeActiveTags(node.id, 'update')} />
                <DeleteIcon onClick={delTag(node.id)} />
              </TagsLabel>
              <div>
                <TagsAdd onClick={changeActiveTags(node.id, 'add')}>
                  <span>добавить подраздел</span>
                </TagsAdd>
              </div>
              {editTagsId === node.id && eventType === 'add' ? (
                <TagsModal
                  text=""
                  visible={visible}
                  onCancel={handleCancel}
                  onSubmit={handleTagsSubmit}
                  node={node}
                />
              ) : (
                ''
              )}
              {editTagsId === node.id && eventType === 'update' ? (
                <TagsModal
                  text={node.title}
                  visible={visible}
                  onCancel={handleCancel}
                  onSubmit={handleTagsSubmit}
                  node={node}
                />
              ) : (
                ''
              )}
            </TagsContainer>
          ),
        })}
      />
      <TagsWrapper>
        <div>
          <Button type="primary" htmlType="submit" onClick={changeActiveTags(-1, 'add')}>
            Добавить новый раздел
          </Button>
          <Button type="primary" htmlType="submit" disabled={disabled} onClick={handleTreeUpdate}>
            Сохранить изменения
          </Button>
          {editTagsId === -1 && eventType === 'add' ? (
            <TagsModal
              text=""
              visible={visible}
              onCancel={handleCancel}
              onSubmit={handleTagsSubmit}
              node={blankTag}
            />
          ) : (
            ''
          )}
        </div>
      </TagsWrapper>
    </div>
  );
};

export default ArticlesTree;

const TagsContainer = styled.div`
  margin: 5px;
  padding: 5px;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
`;

const TagsLabel = styled.div`
  margin: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TagsAdd = styled.p`
  font-size: 10px;
  margin-top: 15px;
  cursor: pointer;
  &:hover {
    color: lightblue;
  }
`;

const WrapperIcon = styled.div`
  &:hover {
    color: lightblue;
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  margin-top: 30px;
  justify-content: space-between;
  align-items: center;
`;

ArticlesTree.propTypes = {
  dataTags: PropTypes.arrayOf.isRequired,
  eventType: PropTypes.string.isRequired,
  changeActiveTags: PropTypes.func.isRequired,
  delTag: PropTypes.func.isRequired,
  updateTagAll: PropTypes.func.isRequired,
  editTagsId: PropTypes.number.isRequired,
  handleTagsSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

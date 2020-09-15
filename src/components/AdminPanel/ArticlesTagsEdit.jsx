import React, { useEffect, useState } from 'react';
import { Menu, message } from 'antd';
import queries from '../../serverQueries/index';
import ArticlesTree from './ArticlesTree';
import { getTreeFromFlatData } from '../../utils';

const ArticlesTagsEdit = () => {
  const [treeData, setTreeData] = useState([]);
  const [editTagsId, setEditTagsId] = useState(-1);
  const [eventType, setEventType] = useState('add');
  const [visible, setVisible] = useState(false);

  const success = () => {
    message.success('Изменения сохранены');
  };

  const error = () => {
    message.error('Что-то пошло не так, повторите запрос позже');
  };

  const handleCancel = () => {
    setVisible(!visible);
  };

  const fetchTags = async () => {
    try {
      const tags = await queries.getTagsDtoTree();
      const data = getTreeFromFlatData(tags);
      setTreeData(data);
    } catch (err) {
      setTreeData([]);
    }
  };

  const addTag = async data => {
    await queries.addNewTagTree(data);
    fetchTags();
  };

  const updateTag = async data => {
    await queries.updateTagsTree(data);
    fetchTags();
  };

  const updateTagAll = async data => {
    try {
      await queries.updateTreeAll(data);
      success();
    } catch (err) {
      error();
    }
  };

  const delTag = id => async () => {
    await queries.deleteTags({ id });
    fetchTags();
  };

  const changeActiveTags = (id, eventT) => evt => {
    evt.preventDefault();
    setVisible(!visible);
    setEventType(eventT);
    setEditTagsId(id);
  };

  const handleTagsSubmit = async ({ id, parentId, position }, { text }) => {
    const checkParentId = parentId === null ? -1 : parentId;
    setVisible(false);
    try {
      if (eventType === 'update') {
        await updateTag({ id, parentId: checkParentId, tagName: text, position });
      } else {
        await addTag({ parentId: id, tagName: text, position });
      }
      setEditTagsId(-1);
      setEventType('add');
    } catch (err) {
      // eslint-disable-next-line no-empty
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div style={{ border: '1px solid lightblue', padding: '20px' }}>
      <Menu mode="inline">
        <ArticlesTree
          dataTags={treeData}
          delTag={delTag}
          changeActiveTags={changeActiveTags}
          handleTagsSubmit={handleTagsSubmit}
          eventType={eventType}
          editTagsId={editTagsId}
          visible={visible}
          handleCancel={handleCancel}
          updateTagAll={updateTagAll}
        />
      </Menu>
    </div>
  );
};

export default ArticlesTagsEdit;

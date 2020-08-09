import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { cloneDeep } from 'lodash';
import queries from '../../serverQueries/index';
import ArticlesTree from './ArticlesTree';

const ArticlesTagsEdit = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [editTagsId, setEditTagsId] = useState(-1);
  const [eventType, setEventType] = useState('add');
  const [visible, setVisible] = useState(false);

  const normalizeData = (data, rest) => {
    return data.map(el => {
      const title = el.tag;
      const { id } = el;
      const { parentId } = el;
      const { tagsHierarchy } = el;
      const { position } = el;
      const children = rest.filter(tag => tag.parentId === el.id);

      return {
        title,
        id,
        parentId,
        tagsHierarchy,
        expanded: true,
        position,
        children: children.length === 0 ? [] : normalizeData(children, rest),
      };
    });
  };

  const getTreeFromFlatData = (data, res = []) => {
    if (data.length === 0) {
      return res;
    }
    const [first, ...rest] = data;
    if (first.parentId === null) {
      const children = rest.filter(
        el => el.parentId === first.id && el.parentId !== null && el.id !== first.id
      );
      const tag = {
        title: first.tag,
        id: first.id,
        position: first.position,
        parentId: first.parentId,
        tagsHierarchy: first.tagsHierarchy,
        expanded: true,
        children: normalizeData(children, rest, first.id),
      };
      res.push(tag);
    }
    return getTreeFromFlatData(rest, res);
  };

  const handleCancel = () => {
    setVisible(!visible);
  };

  const fetchTags = async () => {
    try {
      const tags = await queries.getTagsDtoTree();
      setMenuItems(tags);
      const tags2 = cloneDeep(tags);
      const data = getTreeFromFlatData(tags2);
      setTreeData(data);
    } catch (err) {
      setMenuItems([]);
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
      {
        <Menu mode="inline">
          <ArticlesTree
            dataTags={treeData}
            menuItems={menuItems}
            delTag={delTag}
            changeActiveTags={changeActiveTags}
            handleTagsSubmit={handleTagsSubmit}
            eventType={eventType}
            editTagsId={editTagsId}
            visible={visible}
            handleCancel={handleCancel}
          />
        </Menu>
      }
    </div>
  );
};

export default ArticlesTagsEdit;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import styled from 'styled-components';
import queries from '../../serverQueries/index';
import TagsForm from '../forms/TagsForm';

const ShowEditorForm = ({ text, left, onSubmit }) => (
  <TagsForm text={text} left={left} onSubmit={onSubmit} />
);

ShowEditorForm.propTypes = {
  text: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  left: PropTypes.string.isRequired,
};

const EditIcon = ({ onClick }) => (
  <Icon type="edit" theme="outlined" onClick={onClick} style={{ marginRight: '10px' }} />
);

EditIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const DeleteIcon = ({ onClick }) => <Icon type="delete" theme="outlined" onClick={onClick} />;

DeleteIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const ArticlesTagsEdit = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editTagsId, setEditTagsId] = useState(-1);
  const [eventType, setEventType] = useState('add');
  const blankTag = { id: -1, position: 1, parentId: -1 };

  const fetchTags = async () => {
    try {
      const tags = await queries.getTagsDtoTree();
      setMenuItems(tags);
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
    setEventType(eventT);
    setEditTagsId(id);
  };

  const handleTagsSubmit = ({ id, parentId, position }) => async ({ text }) => {
    const checkParentId = parentId === null ? -1 : parentId;
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

  const buildTreeTags = (tags, result = []) => {
    if (tags.length === 0) {
      return result;
    }
    const [first, ...rest] = tags;
    const left = `${first.tagsHierarchy.length * 20}px`;
    if (menuItems.some(el => el.parentId === first.id)) {
      return buildTreeTags(rest, [
        ...result,
        <li key={`item-${first.id}`}>
          <TagsItem left={left}>
            <div>
              <TagsLabel>{first.tag}</TagsLabel>
              <EditIcon onClick={changeActiveTags(first.id, 'update')} />
              <DeleteIcon onClick={delTag(first.id)} />
            </div>
            <TagsAdd role="button" tabIndex="0" onClick={changeActiveTags(first.id, 'add')}>
              <span>добавить подраздел</span>
            </TagsAdd>
          </TagsItem>
          {editTagsId === first.id && eventType === 'add' ? (
            <ShowEditorForm text="" left={left} onSubmit={handleTagsSubmit(first)} />
          ) : (
            ''
          )}
          {editTagsId === first.id && eventType === 'update' ? (
            <ShowEditorForm text={first.tag} left={left} onSubmit={handleTagsSubmit(first)} />
          ) : (
            ''
          )}
          <ul>{buildTreeTags(menuItems.filter(elem => elem.parentId === first.id))}</ul>
        </li>,
      ]);
    }
    return buildTreeTags(rest, [
      ...result,
      <li key={`item-${first.id}`}>
        <TagsItem left={left}>
          <div>
            <TagsLabel>{first.tag}</TagsLabel>
            <EditIcon onClick={changeActiveTags(first.id, 'update')} />
            <DeleteIcon onClick={delTag(first.id)} />
          </div>
          <TagsAdd role="button" tabIndex="0" onClick={changeActiveTags(first.id, 'add')}>
            <span>добавить подраздел</span>
          </TagsAdd>
        </TagsItem>
        {editTagsId === first.id && eventType === 'add' ? (
          <ShowEditorForm text="" left={left} onSubmit={handleTagsSubmit(first)} />
        ) : (
          ''
        )}
        {editTagsId === first.id && eventType === 'update' ? (
          <ShowEditorForm text={first.tag} left={left} onSubmit={handleTagsSubmit(first)} />
        ) : (
          ''
        )}
      </li>,
    ]);
  };

  return (
    <div style={{ border: '1px solid lightblue', padding: '20px' }}>
      {
        <Menu mode="inline">
          {menuItems ? buildTreeTags(menuItems.filter(el => el.parentId === null)) : null}
          <TagsAddFirst role="button" tabIndex="0" onClick={changeActiveTags(-1, 'add')}>
            <span>Добавить новый раздел</span>
          </TagsAddFirst>
          {editTagsId === -1 && eventType === 'add' ? (
            <ShowEditorForm text="" left="20px" onSubmit={handleTagsSubmit(blankTag)} />
          ) : (
            ''
          )}
        </Menu>
      }
    </div>
  );
};

export default ArticlesTagsEdit;

const TagsItem = styled.div`
  margin: 0;
  display: flex;
  height: 60px;
  flex-direction: column;
  padding-left: ${props => `${props.left}`};
`;
const TagsLabel = styled.span`
  font-size: 16px;
  margin-right: 15px;
`;
const TagsAdd = styled.p`
  font-size: 10px;
  margin-top: 15px;
  cursor: pointer;
  &:hover {
    color: lightblue;
  }
`;
const TagsAddFirst = styled.p`
  cursor: pointer;
  margin-left: 20px;
  &:hover {
    color: lightblue;
  }
`;

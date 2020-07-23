import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, Spin } from 'antd';
import { useHistory, withRouter } from 'react-router-dom';
import { StyledMenu, TagsItem } from '../styled';
import queries from '../../../serverQueries/index';
import useQuery from '../../../hooks/useQuery';

const TagsMenu = ({ location }) => {
  const [menuItems, setMenuItems] = useState([]);
  const history = useHistory();
  const [activeId, setActiveId] = useState(null);
  const hierarchy = useQuery().tags;
  const [isLoading, setIsLoading] = useState(false);
  const addActiveTag = tags => {
    const activeTag = tags.find(tag => hierarchy === tag.tagsHierarchy.join('_')) || {};
    setActiveId(activeTag.id);
  };

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      queries
        .getTagsDtoTree()
        .then(el => {
          if (el) {
            setMenuItems(el);
            addActiveTag(el);
          }
        })
        .catch(() => {
          setMenuItems([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (Array.isArray(menuItems)) {
      addActiveTag(menuItems);
    }
  }, [location]);

  const showArticles = tags => () => {
    history.push(`articles?tags=${tags.join('_')}`);
  };

  const buildTreeMenu = (tags, result = []) => {
    if (tags.length === 0 && result.length !== 0) {
      return result;
    }

    if (tags.length === 0) {
      return (
        <li>
          <TagsItem active={false} cursor="default" pad={1}>
            Нет тегов
          </TagsItem>
        </li>
      );
    }

    if (tags.length === 0) {
      return (
        <li>
          <TagsItem active={false} cursor="default" pad={1}>
            Нет тегов
          </TagsItem>
        </li>
      );
    }
    const [first, ...rest] = tags;
    if (menuItems.some(el => el.parentId === first.id)) {
      return buildTreeMenu(rest, [
        ...result,
        <li key={`item-${first.id}`}>
          <TagsItem
            onClick={showArticles(first.tagsHierarchy, first.id)}
            active={first.id}
            activeId={activeId}
            pad={first.tagsHierarchy.length}
          >
            {first.tag}
          </TagsItem>
          <ul>{buildTreeMenu(menuItems.filter(elem => elem.parentId === first.id))}</ul>
        </li>,
      ]);
    }
    return buildTreeMenu(rest, [
      ...result,
      <li key={`item-${first.id}`}>
        <TagsItem
          active={first.id}
          activeId={activeId}
          onClick={showArticles(first.tagsHierarchy, first.id)}
          pad={first.tagsHierarchy.length}
        >
          {first.tag}
        </TagsItem>
      </li>,
    ]);
  };

  return (
    <StyledMenu>
      {menuItems.length > 0 || !isLoading ? (
        <Menu mode="inline">{buildTreeMenu(menuItems.filter(el => el.parentId === null))}</Menu>
      ) : (
        <Spin />
      )}
    </StyledMenu>
  );
};

TagsMenu.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
};

export default withRouter(TagsMenu);

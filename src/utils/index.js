import { formatDistance, parseISO, format } from 'date-fns';
import ru from 'date-fns/locale/ru';

// eslint-disable-next-line import/prefer-default-export
export const dateToDateDistance = (isoDate, addSuffix = false) =>
  isoDate && formatDistance(parseISO(isoDate), new Date(), { locale: ru, addSuffix });

export const dataToFormatedDate = isoDate =>
  isoDate &&
  format(parseISO(isoDate), "dd MMMM yyyy 'в' HH:mm", {
    locale: ru,
  });

export const mapRoleToString = role => {
  const roles = {
    ROLE_ADMIN: 'Администратор',
    ROLE_MODERATOR: 'Модератор',
    ROLE_USER: 'Пользователь',
    ROLE_PROSPECT: 'Prospect',
  };
  return roles[role];
};

export const paramsSerializer = params =>
  Object.entries(params)
    .reduce((acc, [key, value]) => {
      const str = Array.isArray(value) ? `&${key}=${value.join(`&${key}=`)}` : `&${key}=${value}`;
      return `${acc}${str}`;
    }, '')
    .slice(1);

export const createTreeBuildFunction = (childKey = 'id', parentKey = 'parentId') => flatArr => {
  const hashTable = Object.create(null);
  flatArr.forEach(node => {
    hashTable[node[childKey]] = { ...node, nested: [] };
  });

  const tree = [];
  flatArr.forEach(node => {
    if (node[parentKey] && node[parentKey] !== -1) {
      hashTable[node[parentKey]].nested.push(hashTable[node[childKey]]);
    } else {
      tree.push(hashTable[node[[childKey]]]);
    }
  });
  return tree;
};

export const formatDateToLocalTimeZone = date => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const dates = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return new Date(Date.UTC(year, month, dates, hours, minutes, seconds));
};

export const convertTimeToMilliseconds = (time = 1) => time * 24 * 60 * 60 * 1000;

const parseTags = ({ title, id, tagsHierarchy, children }, parentId, index, acc = []) => {
  const nevTag = {
    tags: title,
    id,
    parentId,
    tagsHierarchy,
    position: index + 1,
  };

  acc.push(nevTag);
  if (children) {
    children.forEach((el, indexEl) => parseTags(el, id, indexEl, acc));
  }
  return acc;
};

export const getFlatDataFromTree = (data, acc = []) => {
  if (data.length === 0) {
    const res = acc.flat(Infinity);
    return res;
  }
  const [first, ...rest] = data;
  const { id, children } = first;
  const nevTags = {
    tags: first.title,
    id: first.id,
    parentId: null,
    tagsHierarchy: first.tagsHierarchy,
    position: first.position,
  };

  acc.push(nevTags);
  if (children === undefined || children.length === 0) {
    return getFlatDataFromTree(rest, acc);
  }
  const child = children.map((el, index) => parseTags(el, id, index));
  return getFlatDataFromTree(rest, [...acc, child]);
};

const collectTags = (data, rest) => {
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
      children: children.length === 0 ? [] : collectTags(children, rest),
    };
  });
};

export const getTreeFromFlatData = (data, res = []) => {
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
      children: collectTags(children, rest, first.id),
    };
    res.push(tag);
  }
  return getTreeFromFlatData(rest, res);
};

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

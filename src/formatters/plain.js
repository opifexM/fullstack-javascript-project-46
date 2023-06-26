import _ from 'lodash';

const getKeyWithParent = (parent, key) => ((parent.length > 0) ? `${parent}.${key}` : key);

const getFormatObject = (obj) => {
  if (_.isObject(obj)) {
    return '[complex value]';
  }
  if (_.isString(obj)) {
    return `'${obj}'`;
  }
  return obj;
};

const addLinePlain = (data1, data2, diffData, parent = '') => Array.from(diffData.entries()).reduce((acc, [diffKey, diffValue]) => {
  const value1 = Object.hasOwn(data1, diffKey) ? data1[diffKey] : 'ERROR';
  const value2 = Object.hasOwn(data2, diffKey) ? data2[diffKey] : 'ERROR';

  let newLines;
  switch (diffValue) {
    case 'deleted':
      newLines = [`Property '${getKeyWithParent(parent, diffKey)}' was removed\n`];
      break;
    case 'added':
      newLines = [`Property '${getKeyWithParent(parent, diffKey)}' was added with value: ${getFormatObject(value2)}\n`];
      break;
    case 'changed':
      newLines = [`Property '${getKeyWithParent(parent, diffKey)}' was updated. From ${getFormatObject(value1)} to ${getFormatObject(value2)}\n`];
      break;
    default:
      newLines = diffValue !== 'unchanged' ? [addLinePlain(value1, value2, diffValue, getKeyWithParent(parent, diffKey))] : [];
  }

  return [...acc, ...newLines];
}, []).join('');

const formatToPlain = (data1, data2, diffData) => addLinePlain(data1, data2, diffData);

export default formatToPlain;

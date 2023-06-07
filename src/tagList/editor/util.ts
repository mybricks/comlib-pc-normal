import { uuid, arrayMove } from '../../utils';
import { Tag } from '../types';

const getTagItem = (data, focusArea): [Tag, number] => {
  const { index } = focusArea.dataset;
  return [data.tags[index], Number(index)];
};

const getTagIndex = ({ focusArea }): number => {
  const { index } = focusArea.dataset;
  return Number(index);
};

const createTag = (content = '新标签') => {
  return {
    key: uuid(),
    content,
    color: 'default'
  };
};

export { getTagItem, getTagIndex, createTag, arrayMove, uuid };

import { uuid, arrayMove } from '../../utils';
import { Tag } from '../types'

export const getTagItem = (data, focusArea): [Tag, number] => {
  const { index } = focusArea.dataset;
  return [data.tags[index], Number(index)];
};

export const createTag = (content='新标签') => {
  return {
    key: uuid(),
    content,
    color: 'default'
  };
};

export { arrayMove, uuid };

import { uuid, arrayMove } from '../../utils';

export const getTagItem = (data, focusArea) => {
  const { index } = focusArea;
  return data.tags[index];
};

export const createTag = () => {
  return {
    key: uuid(),
    content: '新标签',
    color: '#52c41a'
  };
};

export { arrayMove };

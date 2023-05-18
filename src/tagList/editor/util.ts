import { uuid, arrayMove } from '../../utils';

export const getTagItem = (data, focusArea) => {
  const { index } = focusArea;
  return data.tags[index];
};

export const createTag = () => {
  return {
    key: uuid(),
    content: '新标签',
    color: '#00000005',
    textColor: '#000000e0',
    borderColor: '#d9d9d9'
  };
};

export { arrayMove };

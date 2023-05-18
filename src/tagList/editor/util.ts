import { uuid, arrayMove } from '../../utils';

export const getTagItem = (data, focusArea) => {
  const { index } = focusArea;
  return data.tags[index];
};

export const createTag = (content='新标签') => {
  return {
    key: uuid(),
    content,
    color: '#00000005',
    textColor: '#000000e0',
    borderColor: '#d9d9d9'
  };
};

export { arrayMove, uuid };

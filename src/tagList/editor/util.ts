import { uuid, arrayMove } from '../../utils';
import { Tag, Data } from '../types';

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

const createStyle = ({ target }: StyleTargetType<Data>) => ({
  title: '描述',
  options: ['font', 'border', { type: 'background', config: { disableBackgroundImage: true } }],
  target
});

export { getTagItem, getTagIndex, createTag, createStyle, arrayMove, uuid };

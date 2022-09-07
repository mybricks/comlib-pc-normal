import { uuid } from '../../utils';
import { Data, Item } from '../constants';

export const getTimelineItem = (
  data: Data,
  focusArea
): {
  item: Item;
  index: number;
} => {
  const key = focusArea?.dataset?.['timelineId'];
  const index = data.timelines.findIndex((def) => key && def.id === key);
  return {
    item: data.timelines[index] || {},
    index
  };
};

export const getNewItem = (data: Data) => {
  const id = uuid();
  const title = `节点${data.timelines.length}`;
  return {
    id,
    title,
    subTitle: '副标题',
    description: '描述'
  };
};

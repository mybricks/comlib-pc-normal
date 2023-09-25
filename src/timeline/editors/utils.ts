import { uuid } from '../../utils';
import { Data, Item, InputIds, SlotIds } from '../constants';
import { DefaultSourceSchema } from './baseEditor';
import { isEqual } from 'lodash';

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
  const { color } = data.timelines[data.timelines.length - 1];
  return {
    id,
    title,
    subTitle: '副标题',
    description: '描述',
    color
  };
};

export const updateSourceSchema = (input, schema) => {
  const sourceInput = input.get(InputIds.SetDataSource);
  if (sourceInput) {
    sourceInput.setSchema(schema);
  }
};

export const updateSlotSchema = (slots, schema) => {
  if (schema.type === 'array') {
    const item = schema.items;
    slots.get(SlotIds.Content)?.inputs.get(InputIds.CurrentDs).setSchema(item);
  }
};

export const isEqualSchema = (sourceSchema) => {
  return isEqual(sourceSchema, DefaultSourceSchema);
};

export const createStyleForDot = ({ target }: StyleModeType<Data>) => ({
  title: '时间轴点',
  options: [
    'border',
    { type: 'background', config: { disableBackgroundImage: true } }
  ],
  target
});

export const createStyleForTitle = ({ target }: StyleModeType<Data>) => ({
  title: '标题',
  options: [
    {
      type: 'font',
      config: {
        disableTextAlign: true
      }
    }
  ],
  target
});

export const createStyleForSubtitle = ({ target }: StyleModeType<Data>) => ({
  title: '副标题',
  options: [
    {
      type: 'font',
      config: {
        disableTextAlign: true
      }
    }
  ],
  target
});

export const createStyleForDesc = ({ target }: StyleModeType<Data>) => ({
  title: '描述',
  options: [
    {
      type: 'font',
      config: {
        disableTextAlign: true
      }
    }
  ],
  target
});

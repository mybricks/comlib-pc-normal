import { uuid } from '../../utils';
import { Data, Item, InputIds, SlotIds } from '../constants';
import { DefaultSourceSchema } from './baseEditor';
import { isEqual } from 'lodash';

type TargetType = { target: string | ((props: EditorResult<Data>) => string) | undefined };

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

export const createStyleForDot = ({ target }: TargetType) => ({
  title: '时间轴点',
  options: ['border'],
  target
});

export const createStyleForTitle = ({ target }: TargetType) => ({
  title: '标题',
  options: ['font'],
  target
});

export const createStyleForSubtitle = ({ target }: TargetType) => ({
  title: '副标题',
  options: ['font'],
  target
});

export const createStyleForDesc = ({ target }: TargetType) => ({
  title: '描述',
  options: ['font'],
  target
});

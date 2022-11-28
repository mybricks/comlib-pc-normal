import { Data, InputIds, SlotIds } from '../constants';
import { getNewItem } from './utils';

export const DefaultSourceSchema = {
  type: 'array',
  items: { type: 'any' }
};

const BaseEditor = [
  {
    title: '动态数据',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return !!data.isDynamic;
      },
      set({ data, input, slots }: EditorResult<Data>, val: boolean) {
        data.isDynamic = val;
        if (val) {
          input.add(InputIds.SetDataSource, '设置数据源', DefaultSourceSchema);
          data.timelines.splice(1);
        } else {
          input.remove(InputIds.SetDataSource);
          data.useContentSlot = val;
          slots.remove(SlotIds.Content);
        }
      }
    }
  },
  {
    title: '自定义节点内容',
    type: 'Switch',
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.isDynamic;
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return !!data.useContentSlot;
      },
      set({ data, slots }: EditorResult<Data>, value: boolean) {
        data.useContentSlot = value;
        if (value) {
          slots.add({
            id: SlotIds.Content,
            title: '自定义节点内容',
            type: 'scope',
            inputs: [
              {
                id: InputIds.CurrentDs,
                title: '当前项数据',
                schema: {
                  type: 'any'
                }
              },
              {
                id: InputIds.Index,
                title: '当前序号',
                schema: {
                  type: 'number'
                }
              }
            ]
          });
        } else {
          slots.remove(SlotIds.Content);
        }
      }
    }
  },
  {
    title: '添加时间轴节点',
    type: 'Button',
    ifVisible({ data }: EditorResult<Data>) {
      return !data.isDynamic;
    },
    value: {
      set({ data }: EditorResult<Data>) {
        const newItem = getNewItem(data);
        data.timelines.push(newItem);
      }
    }
  }
];
export default BaseEditor;

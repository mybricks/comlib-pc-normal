import { Data, InputIds, SlotIds, OutputIds } from '../constants';
import { getNewItem } from './utils';

export const DefaultSourceSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: {
        type: 'string'
      },
      subTitle: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      color: {
        type: 'string'
      }
    }
  }
};

const BaseEditor = [
  {
    title: '动态数据',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return !!data.isDynamic;
      },
      set({ data, input, slots, output }: EditorResult<Data>, val: boolean) {
        data.isDynamic = val;
        if (val) {
          input.add(InputIds.SetDataSource, '设置数据源', DefaultSourceSchema);
          output.add(OutputIds.SetDataSourceComplete, '完成', {type: 'any'})
          input.get(InputIds.SetDataSource).setRels([OutputIds.SetDataSourceComplete])
          data.timelines.splice(1);
        } else {
          input.remove(InputIds.SetDataSource);
          output.remove(OutputIds.SetDataSourceComplete)
          data.useContentSlot = val;
          if (slots?.get(SlotIds.Content)) {
            slots.remove(SlotIds.Content);
          }
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
          if (slots?.get(SlotIds.Content)) {
            slots.remove(SlotIds.Content);
          }
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

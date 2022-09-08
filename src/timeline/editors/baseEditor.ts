import { Data, DataSourceEnum, InputIds, Schemas, SlotIds } from '../constants';
import { getNewItem } from './utils';

const BaseEditor = [
  {
    title: '数据来源',
    type: 'Select',
    options: [
      {
        label: '手动搭建',
        value: DataSourceEnum.STATIC
      },
      {
        label: '动态获取',
        value: DataSourceEnum.DYNAMIC
      }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.dataSource;
      },
      set({ data, input }: EditorResult<Data>, value: DataSourceEnum) {
        data.dataSource = value;
        if (value === DataSourceEnum.DYNAMIC) {
          input.add(InputIds.SetDataSource, '设置数据源', Schemas[InputIds.SetDataSource]);
          data.timelines.splice(1);
        } else {
          input.remove(InputIds.SetDataSource);
        }
      }
    }
  },
  {
    title: '自定义节点内容',
    type: 'Switch',
    ifVisible({ data }: EditorResult<Data>) {
      return data.dataSource === DataSourceEnum.DYNAMIC;
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useContentSlot;
      },
      set({ data, slot }: EditorResult<Data>, value: boolean) {
        data.useContentSlot = value;
        if (value) {
          slot.add({ id: SlotIds.Content, title: '自定义节点内容', type: 'scope' });
          slot
            .get(SlotIds.Content)
            .inputs.add(InputIds.CurrentDs, '当前项数据', Schemas[InputIds.CurrentDs]);
          slot.get(SlotIds.Content).inputs.add(InputIds.Index, '当前序号', Schemas.Number);
        } else {
          slot.remove(SlotIds.Content);
        }
      }
    }
  },
  {
    title: '添加时间轴节点',
    type: 'Button',
    ifVisible({ data }: EditorResult<Data>) {
      return data.dataSource !== DataSourceEnum.DYNAMIC;
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

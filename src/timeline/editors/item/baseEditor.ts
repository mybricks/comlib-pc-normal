import { Data, DataSourceEnum, InputIds, Schemas, SlotIds } from '../../constants';
import { getTimelineItem } from '../utils';

const BaseEditor = [
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
    title: '基础配置',
    ifVisible({ data }: EditorResult<Data>) {
      return data.dataSource === DataSourceEnum.STATIC;
    },
    items: [
      {
        title: '标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            return item.title;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            item.title = value;
          }
        }
      },
      {
        title: '副标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            return item.subTitle;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            item.subTitle = value;
          }
        }
      },
      {
        title: '描述',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            return item.description;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            item.description = value;
          }
        }
      },
      ,
      {
        title: '圆框颜色',
        type: 'ColorPicker',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            return item.color;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getTimelineItem(data, focusArea);
            item.color = value;
          }
        }
      }
    ]
  }
];
export default BaseEditor;

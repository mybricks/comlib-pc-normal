import { Data } from '../../constants';
import { getTimelineItem } from '../utils';

const IndexEditor = [
  {
    title: '操作',
    ifVisible({ data }: EditorResult<Data>) {
      return !data.isDynamic && data.timelines.length > 1;
    },
    items: [
      {
        title: '前移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const { index } = getTimelineItem(data, focusArea);
          return focusArea && index !== undefined && index !== 0;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = getTimelineItem(data, focusArea);
            if (index < 1) return;
            const tempOption = data.timelines[index - 1];
            data.timelines[index - 1] = data.timelines[index];
            data.timelines[index] = tempOption;
          }
        }
      },
      {
        title: '后移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const { index } = getTimelineItem(data, focusArea);
          return index !== undefined && index + 1 !== data.timelines.length;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = getTimelineItem(data, focusArea);
            if (index === data.timelines.length - 1) return;
            const tempOption = data.timelines[index + 1];
            data.timelines[index + 1] = data.timelines[index];
            data.timelines[index] = tempOption;
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return data.timelines.length > 1;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = getTimelineItem(data, focusArea);
            data.timelines.splice(index, 1);
          }
        }
      }
    ]
  }
];

export default IndexEditor;

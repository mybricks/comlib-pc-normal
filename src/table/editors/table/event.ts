import { OutputIds } from '../../constants';
import { Data } from '../../types';

export const EventEditor = [
  {
    title: '筛选事件',
    type: '_Event',
    ifVisible({ data }: EditorResult<Data>) {
      return data.columns.some((item) => item.filter?.enable && item.filter?.type === 'request');
    },
    options: () => {
      return {
        outputId: OutputIds.FILTER
      };
    }
  },
  {
    title: '排序事件',
    type: '_Event',
    ifVisible({ data }: EditorResult<Data>) {
      return data.columns.some((item) => item.sorter?.enable && item.sorter?.type === 'request');
    },
    options: () => {
      return {
        outputId: OutputIds.SORTER
      };
    }
  }
];

import { OutputIds } from '../../constants';
import { Data } from '../../types';

const EventEditor = [
  {
    title: '点击筛选事件',
    description: '点击筛选按钮时触发',
    type: '_Event',
    ifVisible({ data, output }: EditorResult<Data>) {
      return !!output.get(OutputIds.FILTER_CLICK)
      // return data.columns.some((item) => item.filter?.enable);
    },
    options: () => {
      return {
        outputId: OutputIds.FILTER_CLICK
      };
    }
  },
  {
    title: '筛选事件',
    description: '数据被筛选后触发',
    type: '_Event',
    ifVisible({ data, output }: EditorResult<Data>) {
      return !!output.get(OutputIds.FILTER)
      // return data.columns.some((item) => item.filter?.enable);
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
      return data.columns.some((item) => item.sorter?.enable);
    },
    options: () => {
      return {
        outputId: OutputIds.SORTER
      };
    }
  }
];

export default EventEditor;

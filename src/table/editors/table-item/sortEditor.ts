import { ContentTypeEnum, Data, SorterTypeEnum } from '../../types';
import { getColumnItem } from '../../utils';
import { InputIds, OutputIds } from '../../constants';
import { Schemas } from '../../schema';

interface Props {
  data: Data;
  output: any;
  input: any;
}
const addSorterIO = ({ data, output, input }: Props) => {
  const event1 = output.get(OutputIds.SORTER);
  const event2 = output.get(OutputIds.GET_SORT);
  const event3 = input.get(InputIds.GET_SORT);
  const event4 = input.get(InputIds.SET_SORT);

  const useSort = data.columns.some((item) => item.sorter?.enable);
  if (useSort) {
    if (!event1) {
      output.add(OutputIds.SORTER, '排序', Schemas.SORTER);
    }
    if (!event2) {
      output.add(OutputIds.GET_SORT, '排序数据', Schemas.SORTER);
    }
    if (!event3) {
      input.add(InputIds.GET_SORT, '获取排序数据', Schemas.Void);
      input.get(InputIds.GET_SORT).setRels([OutputIds.GET_SORT]);
    }
    if (!event4) {
      input.add(InputIds.SET_SORT, '设置排序数据', Schemas.SORTER);
      output.add(OutputIds.SET_SORT, '排序数据', Schemas.SORTER);
      input.get(InputIds.SET_SORT).setRels([OutputIds.SET_SORT]);
    }
  } else {
    event1 && output.remove(OutputIds.SORTER);
    event2 && output.remove(OutputIds.GET_SORT);
    event3 && input.remove(InputIds.GET_SORT);
    event4 && input.remove(InputIds.SET_SORT);
    event4 && output.remove(OutputIds.SET_SORT);
  }
};

const SortEditor = {
  title: '排序',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = getColumnItem(data, focusArea);
    return item && [ContentTypeEnum.Text, ContentTypeEnum.SlotItem].includes(item.contentType);
  },
  items: [
    {
      title: '使用排序',
      type: 'Switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.sorter?.enable;
        },
        set({ data, output, input, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          if (item.sorter) {
            item.sorter.enable = value;
          } else {
            item.sorter = {
              enable: value,
              type: SorterTypeEnum.Length
            };
          }
          addSorterIO({ data, input, output });
        }
      }
    },
    {
      title: '排序方式',
      type: 'Select',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item && item.sorter?.enable;
      },
      options: [
        { label: '字符长度', value: SorterTypeEnum.Length },
        { label: '数字大小', value: SorterTypeEnum.Size },
        { label: '时间前后', value: SorterTypeEnum.Date },
        { label: '自定义', value: SorterTypeEnum.Request }
      ],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          return item.sorter?.type || SorterTypeEnum.Length;
        },
        set({ data, focusArea, output, input }: EditorResult<Data>, value: SorterTypeEnum) {
          if (!focusArea) return;
          const item = getColumnItem(data, focusArea);
          if (item.sorter) {
            item.sorter.type = value;
          }
          addSorterIO({ data, output, input });
        }
      }
    },
    {
      title: '排序事件',
      type: '_Event',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item.sorter?.enable && item.sorter?.type === SorterTypeEnum.Request;
      },
      options: () => {
        return {
          outputId: OutputIds.SORTER
        };
      }
    },

  ]
};

export default SortEditor;

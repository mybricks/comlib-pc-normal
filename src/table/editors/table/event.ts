import { Schemas, setDataSchema } from '../../schema';
import { InputIds, OutputIds } from '../../constants';
import { Data, FilterTypeEnum, SorterTypeEnum } from '../../types';

const EventEditor = [
  {
    title: '筛选事件',
    type: '_Event',
    ifVisible({ data }: EditorResult<Data>) {
      return data.columns.some(
        (item) => item.filter?.enable && item.filter?.type === FilterTypeEnum.Request
      );
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
      return data.columns.some(
        (item) => item.sorter?.enable && item.sorter?.type === SorterTypeEnum.Request
      );
    },
    options: () => {
      return {
        outputId: OutputIds.SORTER
      };
    }
  },
  {
    title: '输出表格数据',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.outputTableData;
      },
      set({ data, input, output, ...res }: EditorResult<Data>, value: boolean) {
        if (value) {
          input.add(InputIds.GET_TABLE_DATA, '输出表格数据', Schemas.Any);
          output.add(OutputIds.GET_TABLE_DATA, '表格数据', Schemas.Array);
          input.get(InputIds.GET_TABLE_DATA).setRels([OutputIds.GET_TABLE_DATA]);
          setDataSchema({ data, input, output, ...res });
        } else {
          input.remove(InputIds.GET_TABLE_DATA);
          output.remove(OutputIds.GET_TABLE_DATA);
        }
        data.outputTableData = value;
      }
    }
  }
];

export default EventEditor

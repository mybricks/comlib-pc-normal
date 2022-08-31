import { Schemas } from '../../schema';
import { InputIds, OutputIds } from '../../constants';
import { Data } from '../../types';

export const refreshEditor = [
  {
    title: '逻辑连线不再触发列配置弹窗',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.noMatchSchema;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.noMatchSchema = value;
      }
    }
  },
  {
    title: '输出表格数据',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.outputTableData;
      },
      set({ data, input, output }: EditorResult<Data>, value: boolean) {
        if (value) {
          input.add(InputIds.GET_TABLE_DATA, '输出表格数据', { type: 'any' });
          output.add(OutputIds.GET_TABLE_DATA, '输出表格数据', Schemas.GET_TABLE_DATA(data));
          input.get(InputIds.GET_TABLE_DATA).setRels([OutputIds.GET_TABLE_DATA]);
        } else {
          input.remove(InputIds.GET_TABLE_DATA);
          output.remove(OutputIds.GET_TABLE_DATA);
        }
        data.outputTableData = value;
      }
    }
  },
  // {
  //   title: '刷新时覆盖历史筛选数据',
  //   type: 'Switch',
  //   value: {
  //     get({ data }: EditorResult<Data>) {
  //       return data.cleanQueryParamsWhenRefresh;
  //     },
  //     set({ data }: EditorResult<Data>, value: boolean) {
  //       data.cleanQueryParamsWhenRefresh = value;
  //     }
  //   }
  // }
];

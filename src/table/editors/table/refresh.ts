import { Data } from '../../types';

export const refreshEditor = [
  {
    title: '刷新时覆盖历史筛选数据',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.cleanQueryParamsWhenRefresh;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.cleanQueryParamsWhenRefresh = value;
      }
    }
  }
];

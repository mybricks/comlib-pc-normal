import { Data } from '../../types';

const scrollToFirstRow = [
  {
    title: '自动滚动到首行',
    description: '当分页、排序、筛选变化后是否滚动到表格顶部',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.scroll.scrollToFirstRowOnChange;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.scroll.scrollToFirstRowOnChange = value;
      }
    }
  }
];

export default scrollToFirstRow;

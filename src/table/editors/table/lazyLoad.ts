import { Data } from '../../types';

const lazyLoad = [
  {
    title: '表格数据懒加载',
    description: '初始只加载部分数据，滚动条接近底部时再多加载一部分数据，直到全部数据加载完',
    ifVisible({ data, style }: EditorResult<Data>) {
      return style.height !== 'auto';
    },
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.lazyLoad;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.lazyLoad = value;
      }
    }
  }
];

export default lazyLoad;

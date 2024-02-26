import { Data, FilterIconEnum } from '../../types';

const filterIconDefault = [
  {
    title: '默认筛选图标',
    type: 'Select',
    options: [
      { label: '漏斗', value: FilterIconEnum.Filter },
      { label: '放大镜', value: FilterIconEnum.Search }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.filterIconDefault || FilterIconEnum.Filter;
      },
      set({ data }: EditorResult<Data>, value: FilterIconEnum) {
        data.filterIconDefault = value;
      }
    }
  }
];

export default filterIconDefault;

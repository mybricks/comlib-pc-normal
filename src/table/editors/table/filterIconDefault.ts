import { Data, FilterIconEnum } from '../../types';

const filterIconDefault = [
  {
    title: '默认筛选图标',
    type: 'Icon',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.filterIconDefault;
      },
      set({ data }: EditorResult<Data>, value: FilterIconEnum) {
        data.filterIconDefault = value;
      }
    }
  }
];

export default filterIconDefault;

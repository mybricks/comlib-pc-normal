import { Data, LayoutEnum, SizeEnum } from '../constants';

export const StyleEditor = [
  {
    title: '大小',
    type: 'Select',
    options: [
      { label: '默认', value: SizeEnum.Default },
      { label: '中等', value: SizeEnum.Middle },
      { label: '小号', value: SizeEnum.Small }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.size;
      },
      set({ data }: EditorResult<Data>, value: SizeEnum) {
        data.size = value;
      }
    }
  },
  {
    title: '列数',
    type: 'Slider',
    options: [{ max: 24, min: 1, steps: 1, formatter: '/24' }],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.column;
      },
      set({ data }: EditorResult<Data>, value: number) {
        data.column = value;
      }
    }
  },
  {
    title: '布局',
    type: 'Select',
    options: [
      // { label: '垂直', value: LayoutEnum.Vertical },
      { label: '水平', value: LayoutEnum.Horizontal }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.layout;
      },
      set({ data }: EditorResult<Data>, value: LayoutEnum) {
        data.layout = value;
      }
    }
  }
];

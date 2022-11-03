import { AlignTypeEnum, Data } from '../constants';

export default [
  {
    title: '吸顶',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useTitleFixed;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.useTitleFixed = value;
      }
    }
  },
  {
    title: '布局',
    type: 'Select',
    options: [
      {
        label: '居左',
        value: AlignTypeEnum.Left
      },
      {
        label: '居中',
        value: AlignTypeEnum.Center
      },
      {
        label: '居右',
        value: AlignTypeEnum.Right
      }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.titleAlign;
      },
      set({ data }: EditorResult<Data>, value: AlignTypeEnum) {
        data.titleAlign = value;
      }
    }
  },
  {
    title: '菜单项左右间距',
    type: 'Text',
    options: {
      type: 'Number'
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.titleMargin;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.titleMargin = parseInt(value, 10) || 0;
      }
    }
  },
  {
    title: '样式',
    type: 'Style',
    options: {
      defaultOpen: false,
      plugins: ['Padding', 'BgColor', 'BgImage', 'Border']
    },
    value: {
      get: ({ data }: EditorResult<Data>) => {
        return data?.titleStyle;
      },
      set: ({ data }: EditorResult<Data>, value) => {
        data.titleStyle = value;
      }
    }
  }
];

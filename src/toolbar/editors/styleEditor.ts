import { AlignEnum, Data } from '../types';

const StyleEditor = [
  {
    title: '对齐方式',
    type: 'Select',
    description: '设置按钮的对齐方式',
    options: [
      { value: AlignEnum.FlexStart, label: '居左' },
      { value: AlignEnum.Center, label: '居中' },
      { value: AlignEnum.FlexEnd, label: '居右' }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.layout;
      },
      set({ data }: EditorResult<Data>, value: AlignEnum) {
        data.layout = value;
      }
    }
  },
  {
    title: '间距',
    type: 'InputNumber',
    description: '设置按钮之间的间距',
    options: [
      { title: '水平', min: 0, width: 100 },
      { title: '垂直', min: 0, width: 100 }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.spaceSize || [4, 4];
      },
      set({ data }: EditorResult<Data>, value: [number, number]) {
        data.spaceSize = value;
      }
    }
  }
];

export default StyleEditor;

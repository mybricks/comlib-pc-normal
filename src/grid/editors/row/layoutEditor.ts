import { Data, JustifyTypeEnum, AlignTypeEnum, IRow } from '../../constants';

const LayoutEditor = (row: IRow) => [
  {
    title: '水平排列方式',
    type: 'Select',
    options: [
      { value: JustifyTypeEnum.Start, label: '居左排列' },
      { value: JustifyTypeEnum.End, label: '居右排列' },
      { value: JustifyTypeEnum.Center, label: '居中排列' },
      { value: JustifyTypeEnum.SpaceAround, label: '均匀排列' },
      { value: JustifyTypeEnum.SpaceBetween, label: '两端对齐' }
    ],
    value: {
      get({}: EditorResult<Data>) {
        return row?.justify;
      },
      set({}: EditorResult<Data>, value: JustifyTypeEnum) {
        row.justify = value;
      }
    }
  },
  {
    title: '垂直对齐方式',
    type: 'Select',
    options: [
      { value: AlignTypeEnum.Stretch, label: '无' },
      { value: AlignTypeEnum.Top, label: '置顶排列' },
      { value: AlignTypeEnum.Middle, label: '居中排列' },
      { value: AlignTypeEnum.Bottom, label: '置底排列' }
    ],
    value: {
      get({}: EditorResult<Data>) {
        return row?.align;
      },
      set({}: EditorResult<Data>, value: AlignTypeEnum) {
        row.align = value;
      }
    }
  }
];
export default LayoutEditor;

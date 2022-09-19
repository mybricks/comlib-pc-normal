import { Data, JustifyTypeEnum, AlignTypeEnum } from '../../constants';
import { getRowItem } from '../utils';

const LayoutEditor = [
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
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getRowItem(data, focusArea);
        return item.justify;
      },
      set({ data, focusArea }: EditorResult<Data>, value: JustifyTypeEnum) {
        if (!focusArea) return;
        const item = getRowItem(data, focusArea);
        item.justify = value;
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
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getRowItem(data, focusArea);
        return item.align;
      },
      set({ data, focusArea }: EditorResult<Data>, value: AlignTypeEnum) {
        if (!focusArea) return;
        const item = getRowItem(data, focusArea);
        item.align = value;
      }
    }
  }
];
export default LayoutEditor;

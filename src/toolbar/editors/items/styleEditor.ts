import { Data, FzCSSProperties, ShapeEnum, SizeEnum, TypeEnum } from '../../types';
import { getBtnItemInfo } from '../../utils';
import { SizeHeightMap } from '../../constants';

const StyleEditor = [
  {
    title: '尺寸',
    type: 'Select',
    options() {
      return [
        { value: SizeEnum.Large, label: '大' },
        { value: SizeEnum.Middle, label: '中等' },
        { value: SizeEnum.Small, label: '小' },
      ];
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.size || data.allSize || SizeEnum.Middle;
      },
      set({ data, focusArea }: EditorResult<Data>, value: SizeEnum) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        item.size = value;
        item.style = {
          ...item.style,
          height: SizeHeightMap[item.size]
        };
      }
    },
  },
  {
    title: '风格',
    type: 'Select',
    options() {
      return [
        { value: TypeEnum.Primary, label: '主按钮' },
        { value: TypeEnum.Default, label: '次按钮' },
        { value: TypeEnum.Dashed, label: '虚线按钮' },
        { value: TypeEnum.Link, label: '链接按钮' },
        { value: TypeEnum.Text, label: '文字按钮' }
      ];
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.type || data.allType || TypeEnum.Default;
      },
      set({ data, focusArea }: EditorResult<Data>, value: TypeEnum) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        item.type = value;
      }
    },
  },
  {
    title: '危险按钮',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return typeof item.danger !== 'undefined' ? item.danger : data.allDanger;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        item.danger = value;
      }
    },
  },
  {
    title: '形状',
    type: 'Select',
    options() {
      return [
        { value: ShapeEnum.Default, label: '默认' },
        { value: ShapeEnum.Circle, label: '(椭)圆' },
        { value: ShapeEnum.Round, label: '圆角矩形' }
      ];
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.shape || data.allShape || ShapeEnum.Default;
      },
      set({ data, focusArea }: EditorResult<Data>, value: ShapeEnum) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        item.shape = value;
      }
    },
  }
];

export default StyleEditor;

import { Data, SizeEnum, ShapeEnum, TypeEnum } from '../constants';

const StyleEditor = [
  {
    title: '尺寸',
    type: 'Select',
    ifVisible({ data }: EditorResult<Data>) {
      return !data.asMapArea;
    },
    options() {
      return [
        { value: SizeEnum.Large, label: '大' },
        { value: SizeEnum.Middle, label: '中等' },
        { value: SizeEnum.Small, label: '小' }
      ];
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        return data.size || SizeEnum.Middle;
      },
      set({ data, focusArea }: EditorResult<Data>, value: SizeEnum) {
        data.size = value;
      }
    }
  },
  {
    title: '风格',
    type: 'Select',
    ifVisible({ data }: EditorResult<Data>) {
      return !data.asMapArea;
    },
    options() {
      return [
        { value: TypeEnum.Primary, label: '主按钮' },
        { value: TypeEnum.Default, label: '次按钮' },
        { value: TypeEnum.Dashed, label: '虚线按钮' },
        // { value: TypeEnum.Danger, label: '危险按钮' },
        { value: TypeEnum.Link, label: '链接按钮' },
        { value: TypeEnum.Text, label: '文字按钮' }
      ];
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        return data.type || TypeEnum.Primary;
      },
      set({ data, focusArea }: EditorResult<Data>, value: TypeEnum) {
        data.type = value;
      }
    }
  },
  {
    title: '危险按钮',
    type: 'Switch',
    ifVisible({ data }: EditorResult<Data>) {
      return !data.asMapArea;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        return data.danger;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        data.danger = value;
      }
    }
  },
  {
    title: '形状',
    type: 'Select',
    ifVisible({ data }: EditorResult<Data>) {
      return !data.asMapArea;
    },
    options() {
      return [
        { value: ShapeEnum.Default, label: '默认' },
        { value: ShapeEnum.Circle, label: '(椭)圆' },
        { value: ShapeEnum.Round, label: '圆角矩形' }
      ];
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        return data.shape || ShapeEnum.Default;
      },
      set({ data, focusArea }: EditorResult<Data>, value: ShapeEnum) {
        data.shape = value;
      }
    }
  }
];

export default StyleEditor;

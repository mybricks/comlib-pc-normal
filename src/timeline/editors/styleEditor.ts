import { Data, ModeEnum } from '../constants';

const StyleEditor = [
  {
    title: '内容位置',
    type: 'Select',
    options: [
      {
        label: '左侧展现',
        value: ModeEnum.Left
      },
      {
        label: '交替展现',
        value: ModeEnum.Alternate
      },
      {
        label: '右侧展现',
        value: ModeEnum.Right
      }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.mode;
      },
      set({ data }: EditorResult<Data>, value: ModeEnum) {
        data.mode = value;
      }
    }
  },
  {
    title: '排序方式',
    type: 'Select',
    options: [
      { label: '正序', value: false },
      { label: '倒序', value: true }
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.reverse;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.reverse = value;
      }
    }
  },
  {
    title: '支持展开收起',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.supportCollapse;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.supportCollapse = value;
      }
    }
  },
  {
    title: '默认折叠',
    type: 'Switch',
    ifVisible({ data }: EditorResult<Data>) {
      return data.supportCollapse;
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.defaultCollapse;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.defaultCollapse = value;
      }
    }
  }
];
export default StyleEditor;

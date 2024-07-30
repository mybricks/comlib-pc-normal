import { Data } from '../types';

const ellipsisEditor = [
  {
    title: '省略配置',
    items: [
      {
        title: '省略',
        type: 'Switch',
        description: '超出工具条长度的按钮，是否折叠成省略号',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useEllipses;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.useEllipses = value;
          }
        }
      },
      {
        title: '最大显示数量',
        type: 'InputNumber',
        description: '工具条中最多显示的按钮数量，超出数量的按钮将折叠成省略号',
        options: [{ width: 100, min: 0 }],
        ifVisible({ data }: EditorResult<Data>) {
          return data.useEllipses;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.maxShowNumber || 0];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.maxShowNumber = value[0];
          }
        }
      }
    ]
  }
];

export default ellipsisEditor;

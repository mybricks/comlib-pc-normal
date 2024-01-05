import { Data } from '../types';

const ellipsisEditor = [
  {
    title: '省略配置',
    items: [
      {
        title: '省略',
        type: 'Switch',
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

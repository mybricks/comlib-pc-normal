import { Data, OverflowEnum } from '../constants';

export const OverflowEditor = [
  {
    title: '滚动条设置',
    items: [
      {
        title: '上下滚动条',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.overflowY === OverflowEnum.Auto;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.overflowY = value ? OverflowEnum.Auto : OverflowEnum.Hidden;
          }
        }
      },
      {
        title: '左右滚动条',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.overflowX === OverflowEnum.Auto;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.overflowX = value ? OverflowEnum.Auto : OverflowEnum.Hidden;
          }
        }
      }
    ]
  }
];

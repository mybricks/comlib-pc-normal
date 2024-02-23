import { Data, OutputIds } from '../constants';

export const AutoScrollEditor = [
  {
    title: '自动滚动设置',
    items: [
      {
        title: '自动滚动',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isAutoScroll;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.isAutoScroll = value;
          }
        }
      },
      {
        title: '滚动方向',
        type: 'select',
        description: '默认滚动方向是纵向的，可选择纵向或者横向',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isAutoScroll;
        },
        options: [
          {
            label: '水平',
            value: 'horizontal'
          },
          {
            label: '垂直',
            value: 'vertical'
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.direction || 'vertical';
          },
          set({ data }: EditorResult<Data>, value: 'horizontal' | 'vertical') {
            data.direction = value;
          }
        }
      },
      {
        title: '单次滚动时间',
        type: 'Inputnumber',
        options: [{ min: 0, width: 200 }],
        description: '自定义滚动速度',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isAutoScroll;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.scrollTime || 2000];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.scrollTime = value[0];
          }
        }
      },
    ]
  }
];
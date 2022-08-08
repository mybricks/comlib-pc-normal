import { Data, OutputIds } from './constants';

export default {
  '@resize': {
    options: ['width']
  },
  ':root'({}, cate1, cate2) {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '选择图标',
        type: 'Icon',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.icon;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.icon = value;
          }
        }
      },
      {
        title: '颜色',
        type: 'colorPicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.color;
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (!data.color) {
              data.color = '#000000';
            }
            data.color = value;
          }
        }
      },
      {
        title: '尺寸',
        type: 'text',
        description: '图标尺寸,支持百分比和定宽',
        value: {
          get({ data }: EditorResult<Data>) {
            return String(data.size);
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (/^\d+$/.test(value)) {
              data.size = `${value}px`;
            } else {
              data.size = value;
            }
          }
        }
      }
    ];

    cate2.title = '事件';
    cate2.items = [
      {
        title: '点击',
        type: '_Event',
        options: () => {
          return {
            outputId: OutputIds.Click
          };
        }
      }
    ];
  }
};

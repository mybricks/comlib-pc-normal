import { Data } from '../types';
export default {
  '@init': ({ style, data }) => {},
  '@resize': {
    options: []
  },
  ':root'({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '标题',
        type: 'text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.title;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.title = val;
          }
        }
      },
      {
        title: '显示冒号',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.colon;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.colon = val;
          }
        }
      },
      {
        title: '列数',
        type: 'Slider',
        options: [{ max: 12, min: 1, steps: 1, formatter: '/12' }],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.column;
          },
          set({ data }: EditorResult<Data>, value: number) {
            data.column = value;
          }
        }
      },
      {
        title: '标签宽度',
        items: [
          {
            title: '自动',
            type: 'switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return !!data.autoWidth;
              },
              set({ data }: EditorResult<Data>, val: boolean) {
                data.autoWidth = val;
              }
            }
          },
          {
            title: '固定宽度',
            type: 'inputNumber',
            ifVisible({ data }: EditorResult<Data>) {
              return !data.autoWidth;
            },
            options: [{ min: 0, width: 120, addonAfter: 'px' }],
            value: {
              get({ data }: EditorResult<Data>) {
                return [data?.globalLabelStyle?.width ?? 65];
              },
              set({ data }: EditorResult<Data>, val: number[]) {
                if (!data.globalLabelStyle) {
                  data.globalLabelStyle = {};
                }
                data.globalLabelStyle.width = val[0];
              }
            }
          }
        ]
      },
      {
        title: '增加描述项',
        type: 'Button',
        value: {
          set({ data }: EditorResult<Data>, val: string) {
            
          }
        }
      }
    ];
    cate[1].title = '样式';
    cate[1].items = [];
  }
};

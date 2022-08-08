import { Data, OutputIds } from './constants';

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '标题',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.title;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.title = value;
          }
        }
      },
      {
        title: '遮罩配置',
        items: [
          {
            title: '遮罩',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.showMask;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.showMask = value;
              }
            }
          },
          {
            title: '点击蒙层后关闭	',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.maskClosable !== false;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.maskClosable = value;
              }
            }
          }
        ]
      },
      {
        title: '页脚配置',
        items: [
          {
            title: '页脚',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.useFooter;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.useFooter = value;
              }
            }
          },
          {
            title: '布局',
            type: 'Select',
            options: [
              { value: 'center', label: '居中' },
              { value: 'left', label: '靠左' },
              { value: 'right', label: '靠右' }
            ],
            ifVisible({ data }: EditorResult<Data>) {
              return data.useFooter;
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.footerAlign;
              },
              set({ data }: EditorResult<Data>, value: string) {
                data.footerAlign = value;
              }
            }
          }
        ]
      },
      {
        title: '事件',
        items: [
          {
            title: '关闭',
            type: '_Event',
            options: () => {
              return {
                outputId: OutputIds.Cancel
              };
            }
          }
        ]
      }
    ];

    cate2.title = '样式';
    cate2.items = [
      {
        title: '内容背景色',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.bodyStyle?.backgroundColor;
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (!data.bodyStyle) {
              data.bodyStyle = {};
            }
            data.bodyStyle.backgroundColor = value;
          }
        }
      },
      {
        title: '抽屉位置',
        type: 'Select',
        description: '抽屉在屏幕展开的位置',
        options() {
          return [
            { label: '上', value: 'top' },
            { label: '下', value: 'bottom' },
            { label: '左', value: 'left' },
            { label: '右', value: 'right' }
          ];
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.position;
          },
          set(
            { data }: EditorResult<Data>,
            value: 'top' | 'right' | 'bottom' | 'left' | undefined
          ) {
            data.position = value;
          }
        }
      },
      {
        title: '抽屉宽高',
        type: 'Style',
        options: {
          plugins: ['Size']
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return {
              height: data.height,
              width: data.width
            };
          },
          set({ data }: EditorResult<Data>, value: any) {
            data.height = value?.height;
            data.width = value?.width;
          }
        }
      }
    ];

    cate3.title = '高级';
    cate3.items = [
      {
        title: '关闭时销毁',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.destroyOnClose;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.destroyOnClose = value;
          }
        }
      }
    ];

    return {
      title: '抽屉'
    };
  }
};

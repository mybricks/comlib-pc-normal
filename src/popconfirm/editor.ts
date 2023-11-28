import { Data } from './types';
export default {
  '@init': ({ data, style }: EditorResult<Data>) => {
    style.width = 'fit-content';
  },
  '@resize': {
    options: ['width']
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
        title: '确认按钮文字',
        type: 'text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.okText;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.okText = val;
          }
        }
      },
      {
        title: '取消按钮文字',
        type: 'text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.cancelText;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.cancelText = val;
          }
        }
      },
      {
        title: '图标',
        type: 'icon',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.icon;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.icon = val;
          }
        }
      },
      {
        title: '是否显示取消按钮',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.showCancel;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.showCancel = val;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '点击确认',
            type: '_event',
            options: {
              outputId: 'onOk'
            }
          },
          {
            title: '点击取消',
            type: '_event',
            options: {
              outputId: 'onCancel'
            }
          }
        ]
      }
    ];
  }
};

import { Data, QRType, QRICON } from './constants';
export default {
  '@init': ({ data, style, output }) => {
    style.width = data.size;
    style.height = data.size;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items({}: EditorResult<Data>, cate1) {
      cate1.title = '配置';
      cate1.items = [
        {
          title: '链接',
          type: 'text',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.link;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.link = value;
            }
          }
        },
        {
          title: '支持Logo',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.hasIcon;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.hasIcon = value;
            }
          }
        },
        {
          title: 'Logo',
          ifVisible({ data }: EditorResult<Data>) {
            return data.hasIcon;
          },
          items: [
            {
              title: '图片地址',
              type: 'imageSelector',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.icon?.url;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.icon.url = value;
                }
              }
            },
            {
              title: '',
              type: 'Style',
              options: {
                plugins: ['SIZE']
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return { ...data.icon };
                },
                set({ data }: EditorResult<Data>, value: QRICON) {
                  data.icon = {
                    ...data.icon,
                    width: value.width,
                    height: value.height
                  };
                }
              }
            }
          ]
        }
      ];
      return { title: '二维码' };
    },
    style: {
      options: ['background', 'padding', 'border'],
      target: '.root'
    }
  }
};

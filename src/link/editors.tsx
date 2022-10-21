import { Actions } from '../utils/history';
import { Data } from './constants';

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
    cate2.title = '样式';

    const normEditor = [
      {
        title: '文本',
        type: 'textarea',
        description: '支持动态输入, 为空时展示链接',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.content;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.content = value;
          }
        }
      },
      {
        title: '链接',
        type: 'textarea',
        description: '支持动态输入',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.url;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.url = value;
          }
        }
      },
      {
        title: '图标自定义',
        type: 'Switch',
        description: '可选择是否需要自定义图标',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isChoose;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.isChoose = value;
          }
        }
      },
      {
        title: '选择图标',
        type: 'icon',
        ifVisible({ data }: EditorResult<Data>) {
          return data.isChoose;
        },
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
        title: '图标位置',
        type: 'Select',
        options: [
          {
            label: '位于文字前',
            value: 'front'
          },
          {
            label: '位于文字后',
            value: 'back'
          }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.isChoose;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.location;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.location = value;
          }
        }
      },
      {
        title: '跳转方式',
        type: 'Select',
        options: [
          {
            label: '路由跳转',
            value: 'push'
          },
          {
            label: '重定向',
            value: 'redirect'
          },
          {
            label: '新标签页',
            value: 'openTab'
          },
          {
            label: '返回',
            value: 'back'
          },
          {
            label: '前进',
            value: 'forward'
          },
          {
            label: '自定义',
            value: 'customEvent'
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            if (!data.routeType) data.routeType = 'openTab';
            return data.routeType;
          },
          set({ data, output }: EditorResult<Data>, value: Actions | 'customEvent') {
            data.routeType = value;
            if (data.routeType === 'customEvent') {
              output.add('click', '点击链接', { type: 'string' });
            } else {
              output.remove('click');
            }
          }
        }
      },
      {
        title: '点击链接',
        type: '_Event',
        ifVisible({ data }: EditorResult<Data>) {
          return data.routeType === 'customEvent';
        },
        options: () => {
          return {
            outputId: 'click'
          };
        }
      }
    ];
    const styleEditor = [
      {
        title: '激活样式',
        description: '开启后，可以为链接分别配置默认样式和鼠标悬浮时的样式',
        type: 'Switch',
        value: {
          get: ({ data }: EditorResult<Data>) => {
            return data.useHoverStyle;
          },
          set: ({ data }: EditorResult<Data>, value: boolean) => {
            data.useHoverStyle = value;
          }
        }
      },
      {
        title: '默认样式',
        type: 'style',
        options: {
          plugins: ['padding', 'border', 'bgcolor', 'bgimage', 'font'],
          fontProps: {
            letterSpace: true,
            fontFamily: false
          }
        },
        ifVisible({ data }: EditorResult<Data>) {
          return !data.useHoverStyle;
        },
        value: {
          get: ({ data }: EditorResult<Data>) => {
            return data.style;
          },
          set: ({ data }: EditorResult<Data>, value) => {
            data.style = value;
          }
        }
      },
      {
        title: '样式',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useHoverStyle;
        },
        catelogChange: {
          value: {
            get({ data }: EditorResult<Data>) {
              return data.styleCatelog;
            },
            set({ data, catelog }: EditorResult<Data>) {
              data.styleCatelog = catelog;
            }
          }
        },
        items: [
          {
            type: 'style',
            catelog: '默认样式',
            options: {
              plugins: ['padding', 'border', 'bgcolor', 'bgimage', 'font'],
              fontProps: {
                letterSpace: true,
                fontFamily: false
              }
            },
            value: {
              get: ({ data }: EditorResult<Data>) => {
                return data.style;
              },
              set: ({ data }: EditorResult<Data>, value) => {
                data.style = value;
              }
            }
          },
          {
            type: 'style',
            catelog: '激活样式',
            options: {
              plugins: ['padding', 'border', 'bgcolor', 'bgimage', 'font'],
              fontProps: {
                letterSpace: true,
                fontFamily: false
              }
            },
            value: {
              get: ({ data }: EditorResult<Data>) => {
                if (!data.hoverStyle) data.hoverStyle = { ...data.style, color: '#40a9ff' };
                return data.hoverStyle;
              },
              set: ({ data }: EditorResult<Data>, value) => {
                data.hoverStyle = value;
              }
            }
          }
        ]
      }
    ];

    cate1.items = normEditor;
    cate2.items = styleEditor;
  }
};

import { Actions } from '../utils/history';
import { Data } from './constants';

export default {
  '@resize': {
    options: ['width']
  },
  ':root': {
    '@dblclick': {
      type: 'text',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.content;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.content = value;
        }
      }
    },
    style: [
      {
        items: [
          {
            catelog: '默认',
            options: ['padding', 'border', 'background', 'font'],
            target: '.linkWrapper',
            initValue: { color: '#1890ff' }
          },
          {
            catelog: '激活',
            options: ['padding', 'border', 'background', 'font'],
            target: '.linkWrapper:hover',
            domTarget: '.linkWrapper',
            initValue: { color: '#40a9ff' }
          }
        ]
      }
    ],
    items: ({}: EditorResult<Data>, cate1) => {
      cate1.title = '常规';
      const normEditor = [
        {
          title: '文本',
          type: 'textarea',
          options: {
            locale: true
          },
          description: '支持动态输入, 为空时展示链接',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.content;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.content = value;
            }
          },
          binding: {
            with: 'data.content',
            schema: {
              type: 'string'
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
          },
          binding: {
            with: 'data.url',
            schema: {
              type: 'string'
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
          },
          binding: {
            with: 'data.isChoose',
            schema: {
              type: 'boolean'
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
          },
          binding: {
            with: 'data.icon',
            schema: {
              type: 'string'
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
      cate1.items = normEditor;
    }
  }
};

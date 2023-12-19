import { Data, IOEvent } from './types';
import { DefaultCode, Comment } from './constants';
import { uuid } from '../utils'
export default {
  ':root': {
    items({ data, env }: EditorResult<Data>, ...catalog) {
      catalog[0].title = '配置';
      catalog[0].items = [
        {
          title: '渲染代码',
          type: 'code',
          options: {
            title: '编辑自定义渲染代码',
            language: 'typescript',
            width: 600,
            minimap: {
              enabled: false
            },
            eslint: {
              parserOptions: {
                ecmaVersion: '2020',
                sourceType: 'module'
              }
            },
            babel: {
              presets: ['env', 'react']
            },
            comments: Comment,
            autoSave: false,
            immediatelySet: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.componentCode ?? DefaultCode;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.componentCode = val;
            }
          }
        },
        {
          title: '渲染数据',
          type: 'code',
          options: {
            language: 'json',
            commentsLineNumber: 0,
            title: '渲染数据',
            width: 600,
            minimap: {
              enabled: false
            },
            autoSave: false,
            immediatelySet: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.props;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.props = val;
            }
          }
        }
      ];
      catalog[1].title = '事件输出';
      catalog[1].items = [
        {
          title: '输出配置',
          type: 'Array',
          options: {
            draggable: false,
            getTitle: (item: IOEvent, index: number) => {
              if (!item.label) {
                item.label = `输出项${index + 1}`;
              }
              return `${item.label}(${item.key})`;
            },
            onAdd: () => {
              return {
                key: uuid()
              };
            },
            items: [
              {
                title: 'ID',
                type: 'textarea',
                value: 'key'
              },
              {
                title: '名称',
                type: 'textarea',
                value: 'label'
              }
            ]
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.events || [];
            },
            set({ data, output }: EditorResult<Data>, value: Array<IOEvent>) {
              if (Array.isArray(value)) {
                value.forEach((item) => {
                  const hasEvent = output.get(item.key);
                  if (hasEvent) {
                    output.setTitle(item.key, item.label);
                  } else {
                    output.add(item.key, item.label, { type: 'any' });
                  }
                });
              }
              (data.events || []).forEach(({ key }) => {
                if (!(value || []).some((item) => item.key === key)) {
                  output.get(key) && output.remove(key);
                }
              });
              data.events = value;
            }
          }
        },
        ...(data.events || []).map((item) => ({
          title: item.label,
          type: '_Event',
          ifVisible: ({ output }: EditorResult<Data>) => {
            return !!output.get(item.key);
          },
          options: {
            outputId: item.key
          }
        }))
      ];
      
    }
  }
};

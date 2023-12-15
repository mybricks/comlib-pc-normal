import { Data } from './types';
import { DefaultCode, Comment } from './constants';
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
          title: '数据',
          type: 'code',
          options: {
            language: 'json',
            commentsLineNumber: 0,
            title: '运行时默认数据',
            width: 600,
            minimap: {
              enabled: false
            },
            autoSave: false
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
      catalog[1].title = '事件';
      catalog[1].items = [];
    }
  }
};

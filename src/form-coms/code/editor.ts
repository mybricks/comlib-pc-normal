import { setPath } from '../../utils/path';
import { Data } from './constants';
import { RuleKeys, ExpRules, getTitle, showMessage } from '../utils/validator';
import { OutputIds } from '../types';
export default {
  '@resize': {
    options: ['width']
  },
  ':root'({}, cate1) {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '提示内容',
        type: 'text',
        description: '该提示内容会在值为空时显示',
        options: {
          locale: true
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.aceConfig.placeholder;
          },
          set({ data }, value: string) {
            data.aceConfig.placeholder = value;
          }
        }
      },
      {
        title: '语言',
        description: '代码编辑框的编程语言, 其中Java和Text不支持格式化',
        type: 'select',
        options: [
          { label: 'CSS', value: 'css' },
          { label: 'HTML', value: 'html' },
          { label: 'Java', value: 'java' },
          { label: 'JavaScript', value: 'javascript' },
          { label: 'JSON', value: 'json' },
          { label: 'SQL', value: 'sql' },
          { label: 'Text', value: 'text' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.aceConfig.language;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.aceConfig.language = value;
          }
        }
      },
      {
        title: '行数限制',
        type: 'inputNumber',
        options: [
          { title: '最小', min: 3, width: 100 },
          { title: '最大', min: 6, width: 100 }
        ],
        description: '行数限制',
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.aceConfig.minLines, data.aceConfig.maxLines];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            [data.aceConfig.minLines, data.aceConfig.maxLines] = value;
          }
        }
      },
      {
        title: '超出换行',
        type: 'switch',
        description: '开启后, 代码超出编辑器宽度后换行展示',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.aceConfig.wrap;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.aceConfig.wrap = value;
          }
        }
      },
      {
        title: '只读',
        type: 'switch',
        description: '设置编辑器是否为只读, 该配置项支持动态设置',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.readOnly;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.readOnly = value;
          }
        }
      },
      {
        title: '字体大小',
        type: 'Slider',
        description: '设置编辑器字体大小',
        options: [{ max: 100, min: 12, steps: 1, formatter: 'px' }],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.aceConfig.fontSize || 12;
          },
          set({ data }: EditorResult<Data>, value: number) {
            data.aceConfig.fontSize = value;
          }
        }
      },
      {
        title: '校验',
        items: [
          {
            title: '校验规则',
            description: '提供快捷校验配置',
            type: 'ArrayCheckbox',
            options: {
              checkField: 'status',
              visibleField: 'visible',
              getTitle,
              items: [
                {
                  title: '提示文字',
                  type: 'Text',
                  options: {
                    locale: true
                  },
                  value: 'message',
                  ifVisible(item: any, index: number) {
                    return showMessage(item.key);
                  }
                },
                {
                  title: '正则表达式',
                  type: 'Text',
                  value: 'regExr',
                  ifVisible(item: any, index: number) {
                    return item.key === RuleKeys.REG_EXP;
                  }
                },
                {
                  title: '编辑校验规则',
                  type: 'code',
                  options: {
                    language: 'javascript',
                    enableFullscreen: false,
                    title: '编辑校验规则',
                    width: 600,
                    minimap: {
                      enabled: false
                    },
                    babel: true,
                    eslint: {
                      parserOptions: {
                        ecmaVersion: '2020',
                        sourceType: 'module'
                      }
                    }
                  },
                  ifVisible(item: any, index: number) {
                    return item.key === RuleKeys.CODE_VALIDATOR;
                  },
                  value: 'validateCode'
                }
              ]
            },
            value: {
              get({ data }) {
                return data.rules.length > 0 ? data.rules : ExpRules;
              },
              set({ data }, value: any) {
                data.rules = value;
              }
            }
          },
          {
            title: '校验触发事件',
            type: '_event',
            ifVisible({ data }: EditorResult<Data>) {
              const customRule = (data.rules || ExpRules).find(
                (i) => i.key === RuleKeys.CUSTOM_EVENT
              );
              return !!customRule?.status;
            },
            options: {
              outputId: OutputIds.OnValidate
            }
          },
        ]
      },
      {
        title: '事件',
        items: [
          {
            title: '数据改变',
            type: '_Event',
            options: () => {
              return {
                outputId: 'onChange'
              };
            }
          }
        ]
      }
    ];
  }
};

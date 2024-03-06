import { Data } from './types';
import { RuleKeys, defaultRules, getTitle } from '../utils/validator';
import styleEditors from './styleEditors';
import { OutputIds } from '../types';
export default {
  '@resize': {
    options: ['width', 'height']
  },
  '@init': ({ style }) => {
    style.width = '100%';
    style.height = 'auto';
  },
  ':root': {
    style: [...styleEditors],
    items: ({ data }: EditorResult<Data>, ...cate) => {
      cate[0].title = '配置';
      cate[0].items = [
        {
          title: '属性',
          items: [
            {
              title: '数据源标题',
              type: 'text',
              options: {
                locale: true
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.titles ? data.titles[0] : '源数据';
                },
                set({ data }: EditorResult<Data>, val: string) {
                  if (!data.titles) {
                    data.titles = [];
                  }
                  data.titles[0] = val;
                }
              }
            },
            {
              title: '目标数据标题',
              type: 'text',
              options: {
                locale: true
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.titles ? data.titles[1] : '目标数据';
                },
                set({ data }: EditorResult<Data>, val: string) {
                  if (!data.titles) {
                    data.titles = [];
                  }
                  data.titles[1] = val;
                }
              }
            },
            {
              title: '模式',
              type: 'select',
              options: {
                options: [
                  {
                    label: '单向',
                    value: true
                  },
                  {
                    label: '双向',
                    value: false
                  }
                ]
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return !!data.oneWay;
                },
                set({ data }: EditorResult<Data>, val: boolean) {
                  data.oneWay = val;
                }
              }
            },
            {
              title: '显示描述',
              type: 'switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.showDesc;
                },
                set({ data }: EditorResult<Data>, val: boolean) {
                  data.showDesc = val;
                }
              }
            },
            {
              title: '可搜索',
              type: 'switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.showSearch;
                },
                set({ data }: EditorResult<Data>, val: boolean) {
                  data.showSearch = val;
                }
              }
            },
            {
              title: '禁用状态',
              type: 'switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return !!data.disabled;
                },
                set({ data }: EditorResult<Data>, val: boolean) {
                  data.disabled = val;
                }
              }
            },
            {
              title: '分页',
              type: 'switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return !!data.showPagination;
                },
                set({ data }: EditorResult<Data>, val: boolean) {
                  data.showPagination = val;
                  if (data.showPagination) {
                    data.pagination = {
                      pageSize: 10
                    };
                  } else {
                    data.pagination = {};
                  }
                }
              }
            },
            {
              title: '每页条数',
              type: 'inputNumber',
              options: [{ min: 1, max: 100, width: 120 }],
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.showPagination;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return [data.pagination?.pageSize || 10];
                },
                set({ data }: EditorResult<Data>, val: number[]) {
                  data.pagination.pageSize = val[0];
                }
              }
            }
          ]
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
                      return item.key === RuleKeys.REQUIRED;
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
                  return data.rules.length > 0 ? data.rules : defaultRules;
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
                const customRule = (data.rules || defaultRules).find(
                  (i) => i.key === RuleKeys.CUSTOM_EVENT
                );
                return !!customRule?.status;
              },
              options: {
                outputId: OutputIds.OnValidate
              }
            }
          ]
        },
        {
          title: '事件',
          items: [
            {
              title: '值初始化',
              type: '_event',
              options: {
                outputId: 'onInitial'
              }
            },
            {
              title: '目标数据更新',
              type: '_Event',
              options: ({}: EditorResult<Data>) => {
                return {
                  outputId: 'onChange'
                };
              }
            }
          ]
        }
      ];
    }
  }
};

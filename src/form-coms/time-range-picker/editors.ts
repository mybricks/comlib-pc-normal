import { Data } from './types';
import { RuleKeys, defaultRules, getTitle } from '../utils/validator';
import { createrCatelogEditor } from '../utils';
import { OutputIds, SizeEnum, SizeOptions } from '../types';

const refreshSchema = ({ data, output }) => {
  const baseType = data.format === 'timeStamp' ? 'number' : 'string';
  const returnValueSchema = data.outFormat === 'string'
    ? {
      type: 'string'
    }
    : {
      type: 'tuple',
      items: [
        {
          type: baseType
        },
        {
          type: baseType
        }
      ]
    };
  output.get(OutputIds.OnValidate).setSchema(returnValueSchema);
}

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  ':root': {
    style: [
      {
        title: '尺寸',
        description: '控件大小, 默认是中(middle)',
        type: 'Select',
        options: SizeOptions,
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.size || 'middle';
          },
          set({ data }: EditorResult<Data>, val: SizeEnum) {
            data.config = {
              ...data.config,
              size: val
            };
          }
        }
      },
      {
        items: createrCatelogEditor({
          catelog: '默认',
          items: [
            {
              title: '边框',
              options: ['border'],
              target: '.ant-picker'
            },
            {
              title: '表单项背景色',
              options: ['background'],
              target: '.ant-picker'
            },
            {
              title: '提示内容',
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: 'input::placeholder'
            },
            {
              title: '清除按钮',
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              target: '.anticon-close-circle'
            },
            {
              title: '时间图标',
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: '.anticon-clock-circle'
            },
            {
              title: '文本内容',
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: '.ant-picker-input>input'
            },
            {
              title: '时间',
              options: [
                'border',
                { type: 'background', config: { disableBackgroundImage: true } },
                { type: 'font', config: { disableTextAlign: true } }
              ],
              global: true,
              target: `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner`
            },
            {
              title: '下拉区域',
              options: [{ type: 'background', config: { disableBackgroundImage: true } }],
              global: true,
              target: '.{id} .ant-picker-panel-container'
            },
            {
              title: '箭头',
              options: [{ type: 'background', config: { disableBackgroundImage: true } }],
              global: true,
              target: '.{id} .ant-picker-range-arrow:before'
            },
            {
              title: '底部操作栏',
              options: [{ type: 'background', config: { disableBackgroundImage: true } }],
              global: true,
              target: `.{id} .ant-picker-ranges`
            },
            {
              title: '确认按钮',
              options: [
                { type: 'background', config: { disableBackgroundImage: true } },
                { type: 'font', config: { disableTextAlign: true } },
                { type: 'border' },
                'BoxShadow'
              ],
              global: true,
              target: `.{id} .ant-btn-primary`
            },
            {
              title: '此刻',
              options: [
                { type: 'font', config: { disableTextAlign: true } }
              ],
              global: true,
              target: `.{id} a`
            }
          ]
        })
      },
      {
        items: createrCatelogEditor({
          catelog: 'Hover',
          items: [
            {
              title: '边框',
              options: ['border'],
              target: '.ant-picker:hover',
              domTarget: '.ant-picker'
            },
            {
              title: '时间',
              options: [
                'border',
                { type: 'background', config: { disableBackgroundImage: true } },
                { type: 'font', config: { disableTextAlign: true } }
              ],
              global: true,
              target: `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner:hover`
            },
            {
              title: '清除按钮',
              catelog: 'Hover',
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: '.anticon-close-circle:hover',
              domTarget: '.anticon-close-circle'
            },
            {
              title: '确认按钮',
              catelog: 'Hover',
              options: [
                { type: 'background', config: { disableBackgroundImage: true } },
                { type: 'font', config: { disableTextAlign: true } },
                { type: 'border' },
                'BoxShadow'
              ],
              global: true,
              target: `.{id}  .ant-btn:not([disabled]):hover`
            },
            {
              title: '此刻',
              options: [
                { type: 'font', config: { disableTextAlign: true } }
              ],
              global: true,
              target: `.{id} a:hover`
            }
          ]
        })
      },
      {
        items: createrCatelogEditor({
          catelog: 'Focus',
          items: [
            {
              title: '边框',
              options: ['border', 'BoxShadow'],
              target: '.ant-picker-focused.ant-picker'
            },
            {
              title: '边框底线',
              options: [{ type: 'background', config: { disableBackgroundImage: true } }],
              target: '.ant-picker-range .ant-picker-active-bar'
            },
          ]
        })
      },
      {
        items: createrCatelogEditor({
          catelog: 'Select',
          items: [
            {
              title: '时间',
              options: [
                'border',
                { type: 'background', config: { disableBackgroundImage: true } },
                { type: 'font', config: { disableTextAlign: true } }
              ],
              global: true,
              target: `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner`
            },
            {
              title: '确认按钮',
              options: [
                { type: 'background', config: { disableBackgroundImage: true } },
                { type: 'font', config: { disableTextAlign: true } },
                { type: 'border' },
                'BoxShadow'
              ],
              global: true,
              target: `.{id}  .ant-btn-primary:active`
            },
            {
              title: '此刻',
              options: [
                { type: 'font', config: { disableTextAlign: true } }
              ],
              global: true,
              target: `.{id} a:active`
            }
          ]
        })
      },
      {
        items: createrCatelogEditor({
          catelog: '禁用',
          items: [
            {
              title: '确认按钮',
              options: [
                { type: 'background', config: { disableBackgroundImage: true } },
                { type: 'font', config: { disableTextAlign: true } },
                { type: 'border' },
              ],
              global: true,
              target: `.{id}  .ant-btn-primary[disabled]`
            },
            {
              title: '表单项',
              catelog: '禁用',
              options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
              target: '.ant-picker.ant-picker-disabled'
            }
          ]
        })
      },
    ],
    items: ({ data }: EditorResult<Data>, ...cate) => {
      cate[0].title = '配置';
      cate[0].items = [
        {
          title: '属性',
          items: [
            {
              title: '前置提示内容',
              type: 'Text',
              options: {
                locale: true
              },
              description: '该提示内容会在值为空时显示',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.placeholder ? data.placeholder[0] : '';
                },
                set({ data }: EditorResult<Data>, val: string) {
                  if (!data.placeholder) {
                    data.placeholder = [] as unknown as [string, string];
                  }
                  data.placeholder[0] = val;
                }
              }
            },
            {
              title: '后置提示内容',
              type: 'Text',
              options: {
                locale: true
              },
              description: '该提示内容会在值为空时显示',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.placeholder ? data.placeholder[1] : '';
                },
                set({ data }: EditorResult<Data>, val: string) {
                  if (!data.placeholder) {
                    data.placeholder = [] as unknown as [string, string];
                  }
                  data.placeholder[1] = val;
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
            }
          ]
        },
        {
          title: '输出数据处理',
          items: [
            {
              title: '时间格式模版',
              type: 'select',
              options: {
                options: [
                  { label: '时:分:秒', value: 'HH:mm:ss' },
                  { label: '时:分', value: 'HH:mm' },
                  { label: '时', value: 'HH' },
                  { label: "时间戳", value: "timeStamp" },
                  { label: '自定义', value: 'custom' }
                ]
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.format || 'HH:mm:ss';
                },
                set({ data, output }: EditorResult<Data>, val: string) {
                  data.format = val;
                  refreshSchema({ data, output });
                }
              }
            },
            {
              title: '自定义模版',
              type: 'text',
              ifVisible({ data }: EditorResult<Data>) {
                return data.format === 'custom';
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.customFormat || 'HH:mm:ss';
                },
                set({ data }: EditorResult<Data>, val: string) {
                  data.customFormat = val;
                }
              }
            },
            {
              title: '输出格式',
              type: 'select',
              description: "建议输入输出格式保持一致",
              options: {
                options: [
                  { label: '数组', value: 'array' },
                  { label: '字符', value: 'string' }
                ]
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.outFormat || 'array';
                },
                set({ data, output }: EditorResult<Data>, val: 'array' | 'string') {
                  data.outFormat = val;
                  refreshSchema({ data, output });
                }
              }
            },
            {
              title: '分隔符',
              type: 'text',
              ifVisible({ data }: EditorResult<Data>) {
                return data.outFormat === 'string';
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.splitChar || '-';
                },
                set({ data }: EditorResult<Data>, val: string) {
                  data.splitChar = val;
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
            },
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
              title: '值更新',
              type: '_Event',
              options: {
                outputId: 'onChange'
              }
            }
          ]
        }
      ];
    }
  }
};

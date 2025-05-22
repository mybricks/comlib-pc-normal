import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { StatusEnum, schemaUpdate } from './const';
import { Data } from './runtime';
import { createrCatelogEditor, templateRender } from '../utils';
import { OutputIds, SizeEnum } from '../types';
import { SwitchSize } from 'antd/lib/switch';

export default {
  '@resize': {
    options: ['width']
  },
  '@init'({ style }) {
    style.width = '100%';
  },
  ':root': {
    style: [
      {
        title: '尺寸',
        description: '控件大小, 默认是中(middle)',
        type: 'Select',
        options: [
          {
            label: '默认',
            value: SizeEnum.Middle
          },
          {
            label: '小',
            value: SizeEnum.Small
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.size || 'middle';
          },
          set({ data }: EditorResult<Data>, val: SwitchSize) {
            data.config = {
              ...data.config,
              size: val
            };
          }
        }
      },
      {
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                title: '控件',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-switch-handle:before'
              },
              {
                title: '文案',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-switch-inner'
              },
              {
                title: '激活',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-switch-checked'
              },
              {
                title: '非激活',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-switch'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: '禁用',
            items: [  
              {
                title: '透明度',
                options: ['opacity'],
                target: '.ant-switch-disabled'
              }
            ]
          })
        ]
      }
    ],
    items: ({ data }: EditorResult<Data>, ...catalog) => {
      catalog[0].title = '常规';

      catalog[0].items = [
        {
          title: '禁用状态',
          type: 'switch',
          description: '是否禁用状态',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.config.disabled;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.config.disabled = value;
            }
          }
        },
        {
          title: '默认状态',
          type: 'select',
          description: '开关默认的状态，可以设置默认开启或者关闭',
          options: [
            {
              label: '开启',
              value: true
            },
            {
              label: '关闭',
              value: false
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.config.checked || false;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.config.checked = value;
            }
          }
        },
        {
          title: '开启值',
          description: '开关开启时的value，可以设置为文本、数字、布尔等类型',
          type: 'valueSelect',
          options: ['text', 'number', 'boolean'],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.checkedValue;
            },
            set({ data, input, output }: EditorResult<Data>, value: any) {
              data.checkedValue = value;
              schemaUpdate(input, output, value, data.uncheckedValue);
            }
          }
        },
        {
          title: '关闭值',
          description: '开关关闭时的value，可以设置为文本、数字、布尔等类型',
          type: 'valueSelect',
          options: ['text', 'number', 'boolean'],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.uncheckedValue;
            },
            set({ data, input, output }: EditorResult<Data>, value: any) {
              data.uncheckedValue = value;
              schemaUpdate(input, output, value, data.checkedValue);
            }
          }
        },
        {
          title: '文案',
          type: 'Map',
          description: '设置开关打开和关闭时展示的文本',
          options: {
            notaddel: true,
            noteditkey: true,
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return (
                data.textMap || {
                  [StatusEnum.check]: '',
                  [StatusEnum.unCheck]: ''
                }
              );
            },
            set({ data }: EditorResult<Data>, value: any) {
              data.textMap = value;
            }
          }
        },
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
                description: '提示文字的表达式（{}）, 例：${标题}不能为空',
                type: 'EXPRESSION',
                options: {
                  autoSize: true,
                  placeholder: '例:${标题}不能为空',
                  suggestions: [
                    {
                      label: '标题',
                      insertText: '标题',
                      detail: `标题`
                    },
                  ],
                  runCode: (script) => {
                    return {
                      success: templateRender(script, { label: "xx标题"})
                    };
                  },
                },
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.REQUIRED;
                },
                value: 'message',
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
            get({ data }: EditorResult<Data>) {
              return data.rules.length > 0 ? data.rules : defaultRules;
            },
            set({ data }: EditorResult<Data>, value: any) {
              data.rules = value;
            }
          }
        },
        {
          title: '校验触发事件',
          type: '_event',
          description: '自定义校验的触发事件，开启自定义校验后校验时会触发【触发校验】输出项事件',
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
        {
          title: '事件',
          items: [
            {
              title: '值初始化',
              description:
                '设置开关的初始值时触发，可以通过逻辑连线连接开关的输入项【设置初始值】触发【值初始化】输出项事件',
              type: '_event',
              options: {
                outputId: 'onInitial'
              }
            },
            {
              title: '值更新',
              description:
                '开关的值发生变化时触发，可以通过逻辑连线连接开关的输入项【设置数据】或用户点击开闭开关触发【值更新】输出项事件',
              type: '_event',
              options: {
                outputId: 'onChange'
              }
            }
            // {
            //   title: '失去焦点',
            //   type: '_event',
            //   options: {
            //     outputId: 'onBlur'
            //   }
            // }
          ]
        }
      ];
    }
  }
};

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  // let detail;
  // if (key === RuleKeys.REG_EXP) {
  //   detail = regExpressions.find(({ value }) => value === regExr)?.label;
  // } else if ([RuleKeys.MIN, RuleKeys.MAX, RuleKeys.MIN_LENGTH, RuleKeys.MAX_LENGTH].includes(key)) {
  //   detail = Array.isArray(numericalLimit) ? numericalLimit[0] || '0' : '0';
  // }
  return title;
};

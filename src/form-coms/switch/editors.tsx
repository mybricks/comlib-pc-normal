import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { StatusEnum } from './const';
import { Data } from './runtime';
import { createrCatelogEditor } from '../utils';
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
              },
              {
                title: '控件',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-switch-handle:before'
              },
              {
                title: '开关内文本',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-switch-inner'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: '禁用',
            items: [
              {
                title: '禁用',
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
          title: '默认值',
          type: 'select',
          options: [
            {
              label: 'True',
              value: true
            },
            {
              label: 'False',
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
          title: '文案',
          type: 'Map',
          options: {
            notaddel: true,
            noteditkey: true
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
              data.config = {
                ...data.config,
                checkedChildren: value[StatusEnum.check],
                unCheckedChildren: value[StatusEnum.unCheck]
              };
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
              // {
              //   title: '提示文字',
              //   description: '提示文字的表达式（{}, =, <, >, ||, &&）, 例：${label}不能为空',
              //   type: 'EXPRESSION',
              //   options: {
              //     autoSize: true,
              //     placeholder: '例：${label}不能为空',
              //     // suggestions: getSuggestions(true),
              //   },
              //   value: 'message'
              // },
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
              type: '_event',
              options: {
                outputId: 'onInitial'
              }
            },
            {
              title: '值更新',
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

import { RuleKeys, defaultValidatorExample } from '../utils/validator';

const phoneNumberRules = [
  {
    key: RuleKeys.REQUIRED,
    status: false,
    visible: true,
    title: '必填',
    message: '内容不能为空'
  },
  {
    key: RuleKeys.CODE_VALIDATOR,
    status: false,
    visible: true,
    title: '代码校验',
    validateCode: defaultValidatorExample
  },
  {
    key: RuleKeys.PHONE_NUMBER_VALIDATOR,
    status: true,
    visible: false,
    title: '手机号校验',
    message: '手机号不符合格式要求'
  }
];

export default {
  '@init'({ data, style }) {
    data.rules = phoneNumberRules;
    style.width = '100%';
  },
  '@resize': {
    options: ['width']
  },
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '提示内容',
        type: 'Text',
        description: '该提示内容会在值为空时显示',
        value: {
          get({ data }) {
            return data.config.placeholder;
          },
          set({ data }, value: string) {
            data.config.placeholder = value;
          }
        }
      },
      {
        title: '前置标签',
        type: 'text',
        description: '带标签的 input，设置前置标签',
        value: {
          get({ data }) {
            return data.config.addonBefore;
          },
          set({ data }, value: string) {
            data.config.addonBefore = value;
          }
        }
      },
      {
        title: '后置标签',
        type: 'text',
        description: '带标签的 input，设置后置标签',
        value: {
          get({ data }) {
            return data.config.addonAfter;
          },
          set({ data }, value: string) {
            data.config.addonAfter = value;
          }
        }
      },
      {
        title: '校验失败提示内容',
        type: 'text',
        description: '手机号校验失败时，显示的提示文字',
        value: {
          get({ data }) {
            const phoneNumberRule = data.rules.find(
              ({ key }) => key === RuleKeys.PHONE_NUMBER_VALIDATOR
            );
            return phoneNumberRule.message;
          },
          set({ data }, value: string) {
            const phoneNumberRule = data.rules.find(
              ({ key }) => key === RuleKeys.PHONE_NUMBER_VALIDATOR
            );
            phoneNumberRule.message = value;
          }
        }
      },
      {
        title: '显示清除图标',
        type: 'switch',
        description: '可以点击清除图标删除内容',
        value: {
          get({ data }) {
            return data.config.allowClear;
          },
          set({ data }, value: boolean) {
            data.config.allowClear = value;
          }
        }
      },
      {
        title: '显示字数',
        type: 'switch',
        description: '是否展示字数',
        value: {
          get({ data }) {
            return data.config.showCount;
          },
          set({ data }, value: boolean) {
            data.config.showCount = value;
          }
        }
      },
      {
        title: '禁用状态',
        type: 'switch',
        description: '是否禁用状态',
        value: {
          get({ data }) {
            return data.config.disabled;
          },
          set({ data }, value: boolean) {
            data.config.disabled = value;
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
              type: 'Text',
              value: 'message',
              ifVisible(item: any, index: number) {
                return item.key !== RuleKeys.CODE_VALIDATOR;
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
            return data.rules;
          },
          set({ data }, value: any) {
            data.rules = value;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '初始化',
            type: '_event',
            options: {
              outputId: 'onInitial'
            }
          },
          {
            title: '值发生改变',
            type: '_event',
            options: {
              outputId: 'onChange'
            }
          },
          {
            title: '失去焦点',
            type: '_event',
            options: {
              outputId: 'onBlur'
            }
          }
        ]
      }
    ];
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

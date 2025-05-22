import {
  RuleKeys,
  defaultValidatorExample,
  emailValidator,
  showMessage,
  getTitle,
  formatRegexRules,
  FormatScene
} from '../utils/validator';
import { SizeEnum, SizeOptions, ValidateTriggerType } from '../types';
import { Data } from './runtime';
import { templateRender } from '../utils'

export const emailRules = [
  {
    key: RuleKeys.REQUIRED,
    status: false,
    visible: true,
    title: '必填',
    message: '内容不能为空'
  },
  {
    key: RuleKeys.Email_VALIDATOR,
    status: true,
    visible: true,
    title: '邮箱校验',
    //message: '邮箱不符合格式要求',
    validateCode: emailValidator
  },
  {
    key: RuleKeys.REG_EXP,
    status: false,
    visible: true,
    title: '正则校验',
    message: '内容不能为空',
    regExr: `^(?!(null|undefined|)$).+`
  },
  {
    key: RuleKeys.MIN_LENGTH,
    status: false,
    visible: true,
    title: '最小长度校验',
    message: '邮箱长度不能小于指定值',
    limitMinLength: [2]
  },
  {
    key: RuleKeys.MAX_LENGTH,
    status: false,
    visible: true,
    title: '最大长度校验',
    message: '邮箱长度不能大于指定值',
    limitMaxLength: [1000]
  },
  {
    key: RuleKeys.CODE_VALIDATOR,
    status: false,
    visible: true,
    title: '代码校验',
    validateCode: defaultValidatorExample
  },
  {
    key: RuleKeys.CUSTOM_EVENT,
    status: false,
    visible: true,
    title: '自定义校验'
  }
];

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
        items: [
          {
            title: '边框',
            options: ['border'],
            target: '.ant-input-affix-wrapper'
          }
        ]
      }
    ],
    items: ({ data }: EditorResult<{ type }>, ...catalog) => {
      catalog[0].title = '常规';
      catalog[0].items = [
        {
          title: '提示内容',
          description: '提示文字的表达式（{}）, 例：${标题}不能为空',
          type: 'EXPRESSION',
          options: {
            locale: true
          },
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
          title: '前置标签',
          type: 'text',
          description: '带标签的 input，设置前置标签',
          options: {
            locale: true
          },
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
          options: {
            locale: true
          },
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
          title: '最大长度',
          type: 'InputNumber',
          description: '可输入的内容最大长度, -1 为不限制',
          options: [{ min: -1 }],
          value: {
            get({ data }) {
              return [data.config.maxLength];
            },
            set({ data }, value: number) {
              data.config['maxLength'] = value[0];
            }
          }
        },
        // {
        //   title: '校验触发时机',
        //   type: 'Select',
        //   description: '配置校验触发的时机',
        //   options: {
        //     mode: 'tags',
        //     multiple: true,
        //     options: [
        //       { label: '值初始化', value: ValidateTriggerType.OnInit },
        //       { label: '值更新', value: ValidateTriggerType.OnChange },
        //       { label: '失去焦点', value: ValidateTriggerType.OnBlur }
        //     ]
        //   },
        //   value: {
        //     get({ data }) {
        //       return data.validateTrigger;
        //     },
        //     set({ data }, value: string[]) {
        //       data.validateTrigger = value;
        //     }
        //   }
        // },
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
                      success: templateRender(script, { label: "xx标题"}, name)
                    };
                  },
                },
                value: 'message',
                ifVisible(item: any, index: number) {
                  return showMessage(item.key);
                }
              },
              {
                title: '正则校验',
                type: 'Text',
                value: 'regExr',
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.REG_EXP;
                }
              },
              {
                title: '最小长度',
                type: 'inputNumber',
                value: 'limitMinLength',
                options: [{ min: 0, max: 10000, width: 100 }],
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.MIN_LENGTH;
                }
              },
              {
                title: '最大长度',
                type: 'inputNumber',
                value: 'limitMaxLength',
                options: [{ min: 0, max: Infinity, width: 100 }],
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.MAX_LENGTH;
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
                  return (
                    item.key === RuleKeys.CODE_VALIDATOR || item.key === RuleKeys.Email_VALIDATOR
                  );
                },
                value: 'validateCode'
              }
            ]
          },
          value: {
            get({ data }) {
              if (data.rules.length == 0) {
                data.rules = emailRules;
              }
              return formatRegexRules(data.rules, FormatScene.Editor);
            },
            set({ data }, value: any) {
              data.rules = formatRegexRules(value);
            }
          }
        },
        ,
        {
          title: '校验触发事件',
          type: '_event',
          ifVisible({ data }) {
            const customRule = data.rules.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
            return !!customRule?.status;
          },
          options: {
            outputId: 'onValidate'
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
  }
};

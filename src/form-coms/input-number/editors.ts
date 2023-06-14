import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%'
  },
  ':root': {
    style: [
      {
        title: '默认样式',
        options: ['border'],
        target: '.ant-input-number'
      },
      {
        title: '激活样式',
        options: ['border'],
        target: '.ant-input-number:hover'
      }
    ],
    items: ({ data }: EditorResult<{ type }>, ...catalog) => {
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
          title: '数值精度',
          description: '精确到小数点后几位',
          type: "Slider",
          options: {
            max: 10,
            min: 0,
            steps: 1,
            formatter: "/10",
          },
          value: {
            get({ data }) {
              return data.config.precision;
            },
            set({ data }, value: number) {
              data.config.precision = value;
            }
          }
        },
        {
          title: '步长',
          type: 'Text',
          description: '默认为1,只允许设置大于0的整数',
          value: {
            get({ data }) {
              return data.config.step;
            },
            set({ data }, value: string) {
              const num = parseInt(value, 10);
              data.config.step = isNaN(num) || num <= 0 ? undefined : num;
            }
          }
        },
        {
          title: '格式化展示',
          type: 'Switch',
          description: '开启开关后，格式化数字，以展示具有具体含义的数据',
          value: {
            get({ data }) {
              return data.isFormatter;
            },
            set({ data }, value: boolean) {
              data.isFormatter = value;
            }
          }
        },
        {
          title: '字符位置',
          type: 'Select',
          ifVisible({ data }) {
            return data.isFormatter;
          },
          options: [
            { label: '前缀', value: 'prefix' },
            { label: '后缀', value: 'suffix' },
          ],
          value: {
            get({ data }) {
              return data.charPostion;
            },
            set({ data }, value: string) {
              data.charPostion = value
            },
          }
        },
        {
          title: '格式化字符',
          type: 'Text',
          description: '默认为¥, 可自定义',
          ifVisible({ data }) {
            return data.isFormatter;
          },
          value: {
            get({ data }) {
              return data.character;
            },
            set({ data }, value: string) {
              data.character = value;
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
            },
            {
              title: '按下回车',
              type: '_event',
              options: {
                outputId: 'onPressEnter'
              }
            }
          ]
        },
      ]
    }
  }
}

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};
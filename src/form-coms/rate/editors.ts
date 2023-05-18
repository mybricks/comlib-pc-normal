import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%'
  },
  '@parentUpdated'({ id, data, parent }, { schema }) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      data.isFormItem = true
    } else {
      data.isFormItem = false
    }
  },
  ':root' ({data}: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '评分总数',
        type: 'Inputnumber',
        options: [
          { min:0 },
        ],
        description: '设置的评分数, 默认是5',
        value: {
          get({ data }) {
            return [data.config.count] || [5];
          },
          set({ data }, value: number[]) {
            data.config.count = value[0];
          }
        }
      },
      {
        title: '默认值',
        type: 'Inputnumber',
        options: [
          { min:0 },
        ],
        description: '初始设置的评分,只允许设置0-count, 以0.5为步长',
        value: {
          get({ data }) {
            return [data.config.defaultValue] || [2.5];
          },
          set({ data }, value: number[]) {
            data.config.defaultValue = value[0];
          }
        }
      },
      {
        title: '只读状态',
        type: 'switch',
        description: '开启后为只读状态, 不可以改变',
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
        title: '其它字符',
        type: 'switch',
        description: '开启后可自定义字符',
        value: {
          get({ data }) {
            return data.isChoose;
          },
          set({ data }, value: boolean) {
            data.isChoose = value;
          }
        }
      },
      {
        title: '其它字符类型',
        type: 'Select',
        ifVisible({ data }) {
          return data.isChoose;
        },
        options: [
          {
            label: '文字',
            value: 'font'
          },
          {
            label: '图标',
            value: 'icon'
          }
        ],
        value: {
          get({ data }) {
            return data.choose;
          },
          set({ data }, value: string) {
            data.choose = value;
          }
        }
      },
      {
        title: '文字',
        type: 'text',
        ifVisible({ data }) {
          return data.isChoose && data.choose === 'font';
        },
        value: {
          get({ data }) {
            return data.font
          },
          set({ data }, value: string) {
            data.font = value
          },
        },
      },
      {
        title: '选择图标',
        type: 'Icon',
        ifVisible({ data }) {
          return data.isChoose && data.choose === 'icon';
        },
        value: {
          get({ data }) {
            return data.icon;
          },
          set({ data }, value: string) {
            data.icon = value;
          }
        }
      },
      {
        title: '颜色',
        type: 'colorPicker',
        value: {
          get({ data }) {
            return data.color;
          },
          set({ data }, value: string) {
            if (!data.color) {
              data.color = '#f66801';
            }
            data.color = value;
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
          }
        ]
      },
    ]
  }
}

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};

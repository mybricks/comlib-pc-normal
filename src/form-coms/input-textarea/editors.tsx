import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';

export default {
  '@resize': {
    options: ['width']
  },
  '@parentUpdated'({ id, data, parent }, { schema }) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      parent['@_setFormItem']({ id, schema: { type: 'string' } });
    }
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
        title: '行数限制',
        type: 'Inputnumber',
        options: [
          { title: '最小', min: 3, width: 100 },
          { title: '最大', min: 6, width: 100 }
        ],
        description: '行数限制',
        value: {
          get({ data }) {
            return [data.minRows || 3, data.maxRows || 6];
          },
          set({ data }, value: number[]) {
            data.minRows = value[0];
            data.maxRows = value[1];
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
        title: '内容最大长度',
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
  return title;
};

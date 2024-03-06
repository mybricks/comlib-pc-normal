import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '默认颜色',
        type: 'colorPicker',
        description: '设置默认颜色',
        value: {
          get({ data }) {
            return data.color || "#000000";
          },
          set({ data }, value: string) {
            data.color = value;
          }
        }
      },
      {
        title: '色块宽度',
        type: 'text',
        description: '色块宽度',
        value: {
          get({ data }) {
            return String(data.width);
          },
          set({ data }, value: string) {
            if (/^\d+$/.test(value)) {
              data.width = `${value}px`;
            } else {
              data.width = value;
            }
          }
        }
      },
      {
        title: '禁用状态',
        type: 'switch',
        description: '开启后为禁用状态, 不可以改变',
        value: {
          get({ data }) {
            return data.disabled;
          },
          set({ data }, value: boolean) {
            data.disabled = value;
          }
        }
      },
      {
        title: '输出数据处理',
        items: [
          {
            title: '格式化类型',
            type: 'Select',
            description: '输出颜色的格式要求',
            options: [
              { label: 'RGB', value: 'rgb' },
              { label: 'HEX', value: 'hex' }
            ],
            value: {
              get({ data }) {
                return data.colorType;
              },
              set({ data }, value: string) {
                data.colorType = value;
              }
            }
          }
        ]
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
              },
              options: {
                locale: true
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
        ifVisible({ data }) {
          const customRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
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

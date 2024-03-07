import { RuleKeys, LengthRules, showMessage, getTitle } from '../utils/validator';
import { Data, Option } from './runtime';

let tempOptions: Option[] = [],
  optionsLength,
  addOption,
  delOption;

const initParams = (data: Data) => {
  if (!data.staticOptions) {
    data.staticOptions = [];
  }
  if (optionsLength === undefined) {
    tempOptions = data.staticOptions || [];
  }
  optionsLength = (data.staticOptions || []).length;
  addOption = (option) => {
    data.staticOptions.push(option);
  };
  delOption = (index: number) => {
    data.staticOptions.splice(index, 1);
  };
};

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  ':root'({ data, env }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';
    catalog[1].title = '高级';

    catalog[0].items = [
      {
        title: '提示内容',
        type: 'Text',
        description: '该提示内容会在值为空时显示',
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
        title: '筛选',
        type: 'switch',
        description: '是否根据输入项内容进行筛选值',
        value: {
          get({ data }) {
            return data.isFilter;
          },
          set({ data }, value: boolean) {
            data.isFilter = value;
          }
        }
      },
      {
        title: '静态选项配置',
        type: 'array',
        options: {
          getTitle: ({ label }) => {
            return env.i18n(label);
          },
          onAdd: () => {
            const defaultOption = {
              value: `选项${optionsLength + 1}`,
              label: `选项${optionsLength + 1}`
            };
            addOption(defaultOption);
            return defaultOption;
          },
          items: [
            {
              title: '选项标签',
              type: 'textarea',
              options: {
                locale: true
              },
              value: 'label'
            },
            {
              title: '选项值',
              type: 'valueSelect',
              options: ['text', 'number', 'boolean'],
              description: '选项的唯一标识，可以修改为有意义的值',
              value: 'value'
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            initParams(data);
            return data.staticOptions;
          },
          set({ data }: EditorResult<Data>, options: Option[]) {
            data.staticOptions = options;
            data.options = options;
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
              options: {
                locale: true
              },
              value: 'message',
              ifVisible(item: any, index: number) {
                return showMessage(item.key);
              }
            },
            {
              title: '正则表达式',
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
                return item.key === RuleKeys.CODE_VALIDATOR;
              },
              value: 'validateCode'
            }
          ]
        },
        value: {
          get({ data }) {
            return data.rules.length > 0 ? data.rules : LengthRules;
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
          const customRule = (data.rules || LengthRules).find(
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
          },
          {
            title: '失去焦点',
            type: '_event',
            options: {
              outputId: 'onBlur'
            }
          },
          {
            title: '值选择',
            type: '_event',
            options: {
              outputId: 'onSelect'
            }
          }
        ]
      }
    ];

    catalog[1].items = [
      {
        title: '搜索补全',
        items: [
          {
            title: '支持搜索补全项',
            type: 'switch',
            description: '根据用户输入项内容自定义选项值',
            value: {
              get({ data }) {
                return data.isOnSearch;
              },
              set({ data, output }, value: boolean) {
                data.isOnSearch = value;
                if (data.isOnSearch === true) {
                  output.add('search', '搜索', { type: 'string' });
                } else {
                  output.remove('search');
                }
              }
            }
          },
          {
            title: '搜索',
            type: '_event',
            ifVisible({ data }) {
              return data.isOnSearch;
            },
            options: {
              outputId: 'search'
            }
          }
        ]
      }
    ];
  }
};

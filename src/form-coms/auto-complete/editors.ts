import { RuleKeys, defaultRules } from '../utils/validator';
import { Data, Option } from './runtime'

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
    style.width = '100%'
  },
  ':root' ({data}: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';
    catalog[1].title = '高级';

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
          getTitle: ({ value }) => {
            return value;
          },
          onRemove: (index: number) => {
            delOption(index);
          },
          onAdd: () => {
            const defaultOption = {
              value: `选项${optionsLength + 1}`
            };
            addOption(defaultOption);
            return defaultOption;
          },
          items: [
            {
              title: '选项值',
              type: 'valueSelect',
              options: ['text'],
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
      },
      
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
          },
        ]
      }
    ];
  }
}

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};
import { uuid } from '../../utils';
import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { Option } from '../types';
import { Data } from './types';

let tempOptions: Option[] = [],
  optionsLength = 0,
  addOption,
  delOption;

const initParams = (data: Data) => {
  if (!data.staticOptions) {
    const defaultOption = {
      label: `选项1`,
      value: `选项1`,
      type: 'default',
      checked: false,
      key: uuid()
    };
    data.staticOptions = [defaultOption];
    data.config.options = data.staticOptions;
  }
  if (tempOptions.length !== data.staticOptions?.length) {
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
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
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
      // 选项配置
      {
        title: '静态选项配置',
        type: 'array',
        options: {
          getTitle: ({ label, checked }) => {
            return `${label}${checked ? ': 默认值' : ''}`;
          },
          onRemove: (index: number) => {
            delOption(index);
          },
          onAdd: () => {
            const defaultOption = {
              label: `选项${optionsLength + 1}`,
              value: `选项${optionsLength + 1}`,
              type: 'default',
              key: uuid()
            };
            addOption(defaultOption);
            return defaultOption;
          },
          items: [
            {
              title: '默认选中',
              type: 'switch',
              value: 'checked'
            },
            {
              title: '禁用',
              type: 'switch',
              value: 'disabled'
            },
            {
              title: '选项标签',
              type: 'textarea',
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
          get({ data, focusArea }: EditorResult<Data>) {
            initParams(data);
            return data.staticOptions;
          },
          set({ data, focusArea }: EditorResult<Data>, options: Option[]) {
            let otherChanged = true;
            tempOptions.forEach((oldOption) => {
              const newOption = options.find((option) => option._id === oldOption._id);
              const currentOption = data.staticOptions.find(
                (option) => option._id === oldOption._id
              );
              if (newOption?.checked === currentOption?.checked) return;
              // 1. 设置了选项的默认选中
              if (newOption?.checked && !oldOption?.checked) {
                otherChanged = false;
                data.value = newOption.value;
              }
              // 2. 取消了选项的默认选中
              if (!newOption?.checked && oldOption?.checked) {
                otherChanged = false;
                data.value = undefined;
              }
            });
            // 3. 非默认选中引起的set
            if (otherChanged) {
              options.forEach((option) => {
                if (option.checked) data.value = option.value;
              });
            }
            // 临时:使用tempOptions存储配置项的prev
            tempOptions = options;
            const formItemVal = data.value;
            // 更新选项
            options = options.map((option) => {
              const checked = formItemVal !== undefined && option.value === formItemVal;
              return {
                ...option,
                checked
              };
            });
            data.staticOptions = options;
            data.config.options = options;
          }
        }
      },
      {
        title: '使用按钮样式',
        description: '是否使用按钮样式',
        type: 'switch',
        value: {
          get({ data }) {
            return data.enableButtonStyle;
          },
          set({ data }, value: boolean) {
            data.enableButtonStyle = value;
          }
        }
      },
      {
        title: '按钮选中后样式',
        type: 'select',
        ifVisible({ data }: EditorResult<Data>) {
          return data.enableButtonStyle;
        },
        options: [
          {
            value: 'outline',
            label: '描边'
          },
          {
            value: 'solid',
            label: '填色'
          }
        ],
        value: {
          get({ data }) {
            return data.buttonStyle || 'outline';
          },
          set({ data }, value: string) {
            data.buttonStyle = value;
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
          getTitle: ({ title }: any) => {
            return title;
          },
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
            return data?.rules?.length > 0 ? data.rules : defaultRules;
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

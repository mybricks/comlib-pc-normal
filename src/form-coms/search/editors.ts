import { RuleKeys, defaultValidatorExample, LengthRules, showMessage, getTitle } from '../utils/validator';
import { Data, Options } from './runtime';
import { uuid } from '../../utils';
import { createrCatelogEditor } from '../utils';
import { SizeEnum, SizeOptions } from '../types';

let tempOptions: Options[] = [],
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
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                title: '边框',
                options: ['border'],
                target: '.ant-input-affix-wrapper'
              },
              {
                title: '表单项背景色',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: ['.ant-input-affix-wrapper', '.ant-input-affix-wrapper>input.ant-input']
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'input::placeholder'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle'
              },
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-input'
              },
              {
                title: '前置标签',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-input-group-addon:first-child'
              },
              {
                title: '搜索标签',
                options: [
                  //'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-input-search > .ant-input-group > .ant-input-group-addon:last-child .ant-input-search-button:not(.ant-btn-primary)'
              },
              {
                options: [
                  'border',
                ],
                target: '.ant-input-search > .ant-input-group > .ant-input-group-addon:last-child .ant-input-search-button'
              },
              {
                title: '搜索按钮',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-btn-primary '
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                title: '边框',
                catelog: 'Hover',
                options: ['border'],
                target: '.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover',
                domTarget: '.ant-input-affix-wrapper'
              },
              {
                title: '清除按钮',
                catelog: 'Hover',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle:hover',
                domTarget: '.anticon-close-circle'
              },
              {
                title: '搜索标签',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-btn:hover'
              },
              {
                title: '搜索按钮',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-btn-primary:hover'
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Focus',
            items: [
              {
                title: '边框',
                catelog: 'Focus',
                options: ['border', 'BoxShadow'],
                target:
                  'span.ant-input-affix-wrapper-focused:not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Select',
            items: [
              {
                title: '搜索标签',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: ['.ant-btn:active']
              },
              {
                title: '搜索按钮',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-btn-primary:active'
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: '禁用',
            items: [
              {
                title: '表单项',
                catelog: '禁用',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: ['.ant-input-affix-wrapper-disabled']
              },
              {
                title: '搜索标签',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-btn[disabled]'
              },
              {
                title: '搜索按钮',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-btn-primary[disabled]'
              },
            ]
          })
        ]
      }
    ],
    items: ({ data, env }: EditorResult<{ type }>, ...catalog) => {
      catalog[0].title = '常规';

      catalog[0].items = [
        {
          title: '提示内容',
          type: 'Text',
          options: {
            locale: true
          },
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
          title: '确认按钮',
          type: 'switch',
          description: '打开确认按钮, 可以设为文字',
          value: {
            get({ data }) {
              return data.isenterButton;
            },
            set({ data }, value: string) {
              data.isenterButton = value;
            }
          }
        },
        {
          title: '确认按钮内容',
          type: 'text',
          options: {
            locale: true
          },
          description: '按钮内文字',
          ifVisible({ data }) {
            return !!data.isenterButton;
          },
          value: {
            get({ data }) {
              return data.enterButton;
            },
            set({ data }, value: string) {
              data.enterButton = value;
            }
          }
        },
        {
          title: '前置标签',
          type: 'text',
          options: {
            locale: true
          },
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
          title: '前置下拉框',
          type: 'Switch',
          description: '下拉框和搜索框组合',
          value: {
            get({ data }) {
              return data.isSelect;
            },
            set({ data, output }, value: boolean) {
              data.isSelect = value;
              if (data.isSelect) {
                output.get('onChange').setSchema({ type: 'array', items: { type: 'string' } });
                output.get('onSearch').setSchema({ type: 'array', items: { type: 'string' } });
                output.get('onBlur').setSchema({ type: 'array', items: { type: 'string' } });
              } else {
                output.get('onChange').setSchema({ type: 'string' });
                output.get('onSearch').setSchema({ type: 'string' });
                output.get('onBlur').setSchema({ type: 'string' });
              }
            }
          }
        },
        {
          title: '下拉框宽度',
          type: 'text',
          description: '图标尺寸,支持百分比和定宽',
          ifVisible({ data }: EditorResult<Data>) {
            return data.isSelect;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return String(data.selectWidth);
            },
            set({ data }: EditorResult<Data>, value: string) {
              if (/^\d+$/.test(value)) {
                data.selectWidth = `${value}px`;
              } else {
                data.selectWidth = value;
              }
            }
          }
        },
        {
          title: '前置选择',
          type: 'array',
          ifVisible({ data }: EditorResult<Data>) {
            return data.isSelect;
          },
          options: {
            getTitle: ({ label, checked }) => {
              return `${env.i18n(label)}${checked ? ': 默认值' : ''}`;
            },
            onAdd: () => {
              const defaultOption = {
                label: `选项${optionsLength + 1}`,
                value: `选项${optionsLength + 1}`,
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
            get({ data }) {
              initParams(data);
              return data.staticOptions;
            },
            set({ data }, options: Options[]) {
              const initValue: any = [];
              options.forEach(({ checked, value }) => {
                if (checked) initValue.push(value);
              });
              if (data.initValue) {
                data.initValue = initValue.find((item) => item !== data.initValue);
              } else {
                data.initValue = initValue[0];
              }
              // 临时:使用tempOptions存储配置项的prev
              tempOptions = options;
              const formItemVal: any = data.initValue;
              // 更新选项
              options = options.map((option) => {
                const checked = formItemVal !== undefined && option.value === formItemVal;
                return {
                  ...option,
                  checked
                };
              });
              data.staticOptions = options;
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
              title: '搜索',
              type: '_event',
              options: {
                outputId: 'onSearch'
              }
            }
          ]
        }
      ];
    }
  }
};

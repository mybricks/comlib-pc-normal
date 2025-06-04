import { uuid } from '../../utils';
import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { InputIds, Option, OutputIds, SizeEnum, SizeOptions, ValidateTriggerType } from '../types';
import { Data } from './types';
import { Schemas, ConnectorFiledName } from './constants';
import { createrCatelogEditor, templateRender } from '../utils';
import { connectorEditor } from '../../utils/connector';

let tempOptions: Option[] = [],
  optionsLength;

const initParams = (data: Data) => {
  if (!data.staticOptions) {
    data.staticOptions = [];
  }
  if (optionsLength === undefined) {
    tempOptions = data.staticOptions || [];
  }
  optionsLength = (data.staticOptions || []).length;
};

const refreshSchema = ({ input, output, data }: { input: any; output: any; data: Data }) => {
  let setValueSchema, returnValueSchema;
  if (data.outputValueType === 'value') {
    returnValueSchema = Schemas.String;
  } else if (data.outputValueType === 'option') {
    returnValueSchema = {
      type: 'object',
      properties: {
        label: Schemas.String,
        value: Schemas.String,
        checked: Schemas.Boolean,
        disabled: Schemas.Boolean
      }
    };
  } else if (data.config.labelInValue) {
    returnValueSchema = {
      type: 'object',
      properties: {
        label: Schemas.String,
        value: Schemas.String
      }
    };
  }
  if (data.config.mode && ['multiple', 'tags'].includes(data.config.mode)) {
    setValueSchema = {
      type: 'array',
      items: Schemas.String
    };
    returnValueSchema = {
      type: 'array',
      items: returnValueSchema
    };
  } else {
    setValueSchema = Schemas.String;
  }
  input.get(InputIds.SetInitialValue)?.setSchema(setValueSchema);
  input.get(InputIds.SetValue).setSchema(setValueSchema);

  output.get(OutputIds.OnInitial)?.setSchema(returnValueSchema);
  output.get(OutputIds.OnChange).setSchema(returnValueSchema);
  output.get(OutputIds.OnBlur).setSchema(returnValueSchema);
  output.get(OutputIds.ReturnValue).setSchema(returnValueSchema);
  output.get(OutputIds.OnValidate).setSchema(returnValueSchema);
};

const reFiledNameSchema = (data: Data, input, output) => {
  const trueValueFieldName = data.valueFieldName || 'value';
  const trueLabelFieldName = data.labelFieldName || 'label';
  const trueDisabledFieldName = data.disabledFieldName || 'disabled';
  const trueCheckedFieldName = data.checkedFieldName || 'checked';

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        [trueLabelFieldName]: {
          title: '标签',
          type: 'string',
          description: '标签'
        },
        [trueValueFieldName]: {
          title: '值',
          type: 'string',
          description: '值'
        },
        [trueDisabledFieldName]: {
          title: '禁用',
          type: 'boolean',
          description: '是否禁用'
        },
        [trueCheckedFieldName]: {
          title: '选中',
          type: 'boolean',
          description: '是否选中'
        }
      }
    }
  };

  const setOptionsPin = input.get('setOptions');
  const setOptionsDonePin = output.get('setOptionsDone');

  if (setOptionsPin) {
    setOptionsPin.setSchema(schema);
  }

  if (setOptionsDonePin) {
    setOptionsDonePin.setSchema(schema);
  }
};

export default {
  ':slot': {},
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  ...connectorEditor(),
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
                title: '表单项',
                items: [
                  {
                    title: '文本内容',
                    options: [{ type: 'font', config: { disableTextAlign: true } }],
                    target: ['.ant-select-selection-item', '.ant-select-selection-search-input']
                  },
                  {
                    title: '提示内容',
                    options: [{ type: 'font', config: { disableTextAlign: true } }],
                    target: '.ant-select-selection-placeholder'
                  },
                  {
                    title: '边框',
                    options: ['border'],
                    target: '.ant-select-selector'
                  },
                  {
                    title: '背景色',
                    options: ['background'],
                    target: '.ant-select:not(.ant-select-customize-input) .ant-select-selector'
                  },
                  {
                    title: '下拉图标',
                    options: [{ type: 'font', config: { disableTextAlign: true } }],
                    target: '.ant-select-arrow'
                  },
                  {
                    title: '清除按钮',
                    options: [{ type: 'font', config: { disableTextAlign: true } }, 'background'],
                    // target: '.anticon-close-circle',
                    target: '.ant-select-allow-clear .ant-select-clear'
                  }
                ]
              },
              {
                title: '标签',
                items: [
                  {
                    title: '标签',
                    options: [
                      'border',
                      { type: 'font', config: { disableTextAlign: true } },
                      { type: 'background', config: { disableBackgroundImage: true } }
                    ],
                    target: [
                      '.ant-select-multiple .ant-select-selection-item',
                      '.ant-select-multiple .ant-select-selection-item-remove'
                    ]
                  },
                  {
                    title: '标签-关闭图标',
                    options: [{ type: 'font', config: { disableTextAlign: true } }],
                    target: ['.ant-select-multiple .ant-select-selection-item-remove']
                  }
                ]
              },
              {
                title: '下拉区域',
                items: [
                  {
                    title: '选项',
                    options: [
                      { type: 'font', config: { disableTextAlign: true } },
                      { type: 'background', config: { disableBackgroundImage: true } }
                    ],
                    global: true,
                    target({ id }: EditorResult<Data>) {
                      return `.{id} div.ant-select-item.ant-select-item-option`;
                    }
                  },
                  {
                    title: '下拉区背景',
                    options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                    global: true,
                    target({ id }: EditorResult<Data>) {
                      return `.{id}.ant-select-dropdown`;
                    }
                  },
                  {
                    title: '空白描述',
                    options: [{ type: 'font', config: { disableTextAlign: true } }],
                    global: true,
                    target({ id }: EditorResult<Data>) {
                      return `.{id} .ant-empty-description`;
                    }
                  }
                ]
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                title: '边框',
                options: ['border'],
                target:
                  'div.ant-select:not(.ant-select-customize-input) > div.ant-select-selector:hover',
                domTarget: 'div.ant-select-selector'
              },
              {
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} div.ant-select-item-option-active:not(.ant-select-item-option-disabled)`;
                }
              },
              {
                title: '清除按钮',
                catelog: 'Hover',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle:hover',
                domTarget: '.anticon-close-circle'
              },
              {
                title: '标签-关闭图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: ['.ant-select-multiple .ant-select-selection-item-remove:hover']
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Focus',
            items: [
              {
                title: '边框',
                options: ['border', 'BoxShadow'],
                target:
                  'div.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) > div.ant-select-selector',
                domTarget: 'div.ant-select-selector'
              },
              {
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} div.ant-select-item.ant-select-item-option.ant-select-item-option-selected:not(.ant-select-item-option-disabled)`;
                }
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Select',
            items: [
              {
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} div.ant-select-item.ant-select-item-option.ant-select-item-option-selected:not(.ant-select-item-option-disabled)`;
                }
              }
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
                target: [
                  '.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector'
                ]
              }
            ]
          })
        ]
      }
    ],
    items: ({ data, env }: EditorResult<{ type }>, ...catalog) => {
      catalog[0].title = '常规';
      catalog[1].title = '高级';

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
          title: '选择框最大高度',
          type: 'Text',
          description:
            '选择框的最大高度，超出后垂直滚动。不设置表示默认配置，设置为0表示适应内容高度。默认单位为像素（px）',
          value: {
            get({ data }) {
              return data.maxHeight;
            },
            set({ data }, value: string) {
              data.maxHeight = value;
            }
          }
        },
        {
          title: '选择框弹出位置',
          type: 'select',
          options: [
            { label: '左上方', value: 'topLeft' },
            { label: '右上方', value: 'topRight' },
            { label: '左下方', value: 'bottomLeft' },
            { label: '右下方', value: 'bottomRight' }
          ],
          value: {
            get({ data }) {
              return data.placement || `bottomLeft`;
            },
            set({ data }, value: string) {
              data.placement = value;
            }
          }
        },
        {
          title: '弹出菜单挂载点',
          description: '可在预览态下看到效果，调试态基于画布元素',
          type: 'select',
          options: [
            { label: 'Body元素', value: 'body' },
            { label: '当前节点', value: 'current' }
          ],
          value: {
            get({ data }) {
              return data.mount || `body`;
            },
            set({ data }, value: string) {
              data.mount = value;
            }
          }
        },
        {
          title: '下拉框模式',
          type: 'select',
          description: '可设置下拉框的模式为多选或标签',
          options: [
            { label: '默认', value: 'default' },
            { label: '多选', value: 'multiple' },
            { label: '标签', value: 'tags' }
          ],
          value: {
            get({ data }) {
              return data.config.mode;
            },
            set({ data, input, output }: EditorResult<Data>, value: string) {
              data.config.mode = value as any;
              if (['multiple', 'tags'].includes(value)) {
                if (data.value != undefined && !Array.isArray(data.value)) {
                  data.value = [data.value] as any;
                }
              } else {
                if (Array.isArray(data.value)) {
                  data.value = data.value[0];
                }
              }
              refreshSchema({ input, output, data });
            }
          }
        },
        {
          title: '标签过多时省略',
          type: 'switch',
          description: '开启后，在宽度不够时，自动省略显示选中的标签',
          ifVisible({ data }: EditorResult<Data>) {
            return ['multiple', 'tags'].includes(data?.config?.mode || '');
          },
          value: {
            get({ data }) {
              return data.maxTagCount === 'responsive';
            },
            set({ data }, value: boolean) {
              data.maxTagCount = value ? 'responsive' : '';
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
          title: '显示下拉箭头',
          type: 'switch',
          value: {
            get({ data }) {
              return data.config.showArrow;
            },
            set({ data }, value: boolean) {
              data.config.showArrow = value;
            }
          }
        },
        {
          title: '下拉菜单和选择器同宽',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.config.dropdownMatchSelectWidth;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.config.dropdownMatchSelectWidth = value;
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
        // 选项配置
        {
          title: '静态选项配置',
          type: 'array',
          ifVisible({ data }: EditorResult<Data>) {
            return !data[ConnectorFiledName];
          },
          options: {
            getTitle: ({ label, checked }) => {
              return `${env.i18n(label)}${checked ? ': 默认值' : ''}`;
            },
            onAdd: () => {
              const value = uuid('_', 2);
              const defaultOption = {
                label: `选项${value}`,
                value: `选项${value}`
              };
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
            get({ data, focusArea }: EditorResult<Data>) {
              initParams(data);
              return data.staticOptions;
            },
            set({ data, focusArea, env }: EditorResult<Data>, options: Option[]) {
              const initValue: any = [];
              options.forEach(({ checked, value, label }) => {
                if (checked) initValue.push(value);
              });
              if (data.config.mode && ['multiple', 'tags'].includes(data.config.mode)) {
                data.value = initValue;
              } else {
                if (data.value && initValue.length > 1) {
                  data.value = initValue.find((item) => item !== data.value);
                } else {
                  data.value = initValue[0];
                }
                // 临时:使用tempOptions存储配置项的prev
                tempOptions = options;
                const formItemVal: any = data.value;
                // 更新选项
                options = options.map((option) => {
                  const checked = formItemVal !== undefined && option.value === formItemVal;
                  return {
                    ...option,
                    checked
                  };
                });
              }
              data.staticOptions = options;
              data.config.options = options;
            }
          },
          binding: {
            with: 'data.config.options',
            schema: {
              type: 'string'
            }
          }
        },
        {
          title: '输出数据',
          type: 'Radio',
          options: [
            { label: '选项值', value: 'value' },
            { label: '{选项标签, 选项值}', value: 'labelInValue' },
            { label: '当前选项', value: 'option' }
          ],
          description: '设置下拉框输出的数据内容',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.outputValueType;
            },
            set(
              { data, input, output }: EditorResult<Data>,
              value: 'value' | 'labelInValue' | 'option'
            ) {
              data.config.labelInValue = value === 'labelInValue';
              data.outputValueType = value;
              refreshSchema({ input, output, data });
            }
          }
        },
        {
          title: '校验触发时机',
          type: 'Select',
          description: '配置校验触发的时机',
          options: {
            mode: 'tags',
            multiple: true,
            options: [
              { label: '值变化', value: ValidateTriggerType.OnChange },
              { label: '失去焦点', value: ValidateTriggerType.OnBlur }
            ]
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.validateTrigger;
            },
            set({ data }: EditorResult<Data>, value: string[]) {
              data.validateTrigger = value;
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
                    }
                  ],
                  runCode: (script) => {
                    return {
                      success: templateRender(script, { label: 'xx标题' })
                    };
                  }
                },
                value: 'message'
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
          title: '校验触发事件',
          type: '_event',
          ifVisible({ data }: EditorResult<Data>) {
            const customRule = (data.rules || defaultRules).find(
              (i) => i.key === RuleKeys.CUSTOM_EVENT
            );
            return !!customRule?.status;
          },
          options: {
            outputId: OutputIds.OnValidate
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

      catalog[1].items = [
        {
          title: '字段配置',
          items: [
            {
              title: '字段配置',
              type: 'switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.customField;
                },
                set({ data, input, output }: EditorResult<Data>, value: boolean) {
                  data.customField = value;
                }
              }
            },
            {
              title: '标题字段',
              type: 'Text',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.customField;
              },
              options: {
                placeholder: '默认值为 label'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.labelFieldName;
                },
                set({ data, input, output }: EditorResult<Data>, value: string) {
                  data.labelFieldName = value;
                  reFiledNameSchema(data, input, output);
                }
              }
            },
            {
              title: '值字段',
              type: 'Text',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.customField;
              },
              options: {
                placeholder: '默认值为 value'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.valueFieldName;
                },
                set({ data, input, output }: EditorResult<Data>, value: string) {
                  data.valueFieldName = value;
                  reFiledNameSchema(data, input, output);
                }
              }
            },
            {
              title: '禁用字段',
              type: 'Text',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.customField;
              },
              options: {
                placeholder: '默认值为 disabled'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.disabledFieldName;
                },
                set({ data, input, output }: EditorResult<Data>, value: string) {
                  data.disabledFieldName = value;
                  reFiledNameSchema(data, input, output);
                }
              }
            },
            {
              title: '选中字段',
              type: 'Text',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.customField;
              },
              options: {
                placeholder: '默认值为 checked'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.checkedFieldName;
                },
                set({ data, input, output }: EditorResult<Data>, value: string) {
                  data.checkedFieldName = value;
                  reFiledNameSchema(data, input, output);
                }
              }
            }
          ]
        },
        {
          title: '输入配置',
          ifVisible({ data }) {
            return ['multiple', 'default'].includes(data.config.mode);
          },
          items: [
            {
              title: '输入',
              type: 'Switch',
              description: '开启后下拉框支持输入，可配置搜索规则',
              value: {
                get({ data }) {
                  return data.config.showSearch !== false;
                },
                set({ data }, value: boolean) {
                  data.config.showSearch = value;
                }
              }
            }
          ]
        },
        {
          title: '默认搜索配置',
          ifVisible({ data }) {
            return (
              ['multiple', 'default'].includes(data.config.mode) &&
              data.config.showSearch !== false &&
              data.dropdownSearchOption !== true
            );
          },
          items: [
            {
              title: '搜索',
              type: 'Switch',
              description: '开启后下拉框可以配置默认搜索规则，与远程搜索的支持搜索动态获取选项互斥',
              value: {
                get({ data }) {
                  return data.config.filterOption !== false;
                },
                set({ data }, value: boolean) {
                  data.config.filterOption = value;
                }
              }
            },
            {
              title: '规则',
              type: 'Select',
              options: [
                {
                  label: '根据内容搜索',
                  value: 'label'
                },
                {
                  label: '根据值搜索',
                  value: 'value'
                }
              ],
              ifVisible({ data }) {
                return data.config.filterOption !== false;
              },
              value: {
                get({ data }) {
                  return data.config.optionFilterProp;
                },
                set({ data }, value: string) {
                  data.config.optionFilterProp = value;
                }
              }
            }
          ]
        },
        {
          title: '远程搜索',
          ifVisible({ data }) {
            // 历史远程和默认都开启过, 以远程搜索为高优先级
            let flag = data.config.filterOption === true && data.dropdownSearchOption === true;
            if (flag) {
              data.config.filterOption = false;
            }
            return (
              ['multiple', 'default'].includes(data.config.mode) &&
              data.config.showSearch !== false &&
              (flag || data.config.filterOption !== true)
            );
          },
          items: [
            {
              title: '支持搜索动态获取选项',
              type: 'Switch',
              description:
                '开启后配置接口，通过"search"参数动态返回{label, value}对象的列表作为下拉选项',
              value: {
                get({ data }) {
                  return data.dropdownSearchOption;
                },
                set({ data, input, output }, value: boolean) {
                  data.dropdownSearchOption = value;
                  let valueSchema = input.get(InputIds.SetValue).schema;
                  const contentSchema = {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        label: {
                          title: '标签',
                          type: 'string'
                        },
                        value: {
                          title: '值',
                          type: valueSchema?.type || 'string'
                        },
                        disabled: {
                          title: '禁用',
                          type: 'boolean'
                        },
                        checked: {
                          title: '选中',
                          type: 'boolean'
                        }
                      }
                    }
                  };
                  if (value) {
                    // 开启后，默认搜索里的filterOption改为false
                    data.config.filterOption = false;
                  }
                  if (data.dropdownSearchOption === true) {
                    output.add('remoteSearch', '远程搜索', { type: 'string' });
                  } else {
                    output.remove('remoteSearch');
                  }
                }
              }
            },
            {
              title: '搜索值为空时重置选项',
              type: 'Switch',
              description: '关闭时，搜索值为空时也需要通过连线设置数据源',
              ifVisible({ data }) {
                return data.dropdownSearchOption;
              },
              value: {
                get({ data }) {
                  return data.resetOptionsWhenEmptySearch;
                },
                set({ data }, value: boolean) {
                  data.resetOptionsWhenEmptySearch = value;
                }
              }
            },
            {
              title: '搜索',
              type: '_event',
              ifVisible({ data }) {
                return data.dropdownSearchOption;
              },
              options: {
                outputId: 'remoteSearch'
              }
            }
          ]
        },
        {
          title: '选项扩展',
          items: [
            {
              title: '后置插槽',
              type: 'Switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return !!data.slotAfterOption;
                },
                set({ data, slot }: EditorResult<Data>, value: boolean) {
                  if (value) {
                    data.slotAfterOption = 'slotAfterOption';
                    slot.add({
                      id: data.slotAfterOption,
                      title: '后置插槽',
                      type: 'scope',
                      inputs: [
                        {
                          id: 'option',
                          title: '当前选项',
                          schema: {
                            type: 'object',
                            properties: {
                              label: {
                                type: 'string'
                              },
                              value: {
                                type: 'any'
                              }
                            }
                          }
                        },
                        {
                          title: '当前索引',
                          id: 'index',
                          schema: {
                            type: 'number'
                          }
                        }
                      ]
                    });
                  } else {
                    slot.remove(data.slotAfterOption);
                    data.slotAfterOption = void 0;
                  }
                }
              }
            },
            {
              title: '显示弹层(仅搭建态生效)',
              type: 'Switch',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.slotAfterOption;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return !data.hidePopWhenEdit;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.hidePopWhenEdit = !value;
                }
              }
            }
          ]
        }
      ];
    }
  }
};

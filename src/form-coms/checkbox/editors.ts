import { uuid } from '../../utils';
import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { Option, OutputIds } from '../types';
import { Data } from './types';
import { createrCatelogEditor } from '../utils';

export const getCheckBoxItemInfo = (
  data: Data,
  focusArea,
  datasetKey = 'checkboxIdx'
): { item: Partial<Option>; index: number } => {
  const key = focusArea?.dataset?.[datasetKey];
  if(key === 'all') {
    return { item: { label: data.checkAllText, key: 'all', index: 0  }}
  }
  const index = data.staticOptions.findIndex((item) => key && item.key === key);
  const res = index === -1 ? undefined : data.staticOptions[index];
  return { item: res, index };
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
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                title: '选择框',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'opacity'
                ],
                target: '.ant-checkbox-inner'
              },
              {
                title: '全选框',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'border'
                ],
                target: '.checkbox > .ant-checkbox-wrapper'
              },
              {
                title: '选项',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'border'
                ],
                target: '.ant-checkbox-group .ant-checkbox-group-item'
              },
              {
                title: '选项标签',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'label.ant-checkbox-wrapper > span:nth-child(2)'
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                title: '选择框',
                options: [
                  'border', 
                  { type: 'background', config: { disableBackgroundImage: true } }, 
                  'opacity'
                ],
                target: '.ant-checkbox:hover .ant-checkbox-inner',
                domTarget: '.ant-checkbox-inner'
              },
              {
                title: '全选框',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'border'
                ],
                target: '.checkbox > .ant-checkbox-wrapper:hover'
              },
              {
                title: '选项',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'border'
                ],
                target: '.ant-checkbox-group .ant-checkbox-group-item:hover'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: '选中',
            items: [
              {
                title: '选择框',
                options: [
                  'border',
                  'BoxShadow',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'opacity'
                ],
                target: '.ant-checkbox-checked .ant-checkbox-inner'
              },
              {
                title: '全选框',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'border'
                ],
                target: '.checkbox > .ant-checkbox-wrapper-checked'
              },
              {
                title: '选项',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'border'
                ],
                target: '.ant-checkbox-group .ant-checkbox-wrapper-checked'
              },
              {
                title: '选项标签',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'label.ant-checkbox-wrapper.ant-checkbox-wrapper-checked > span:nth-child(2)'
              },
              {
                title: '选择框勾选符号',
                options: [
                  {
                    type: 'border',
                    config: {
                      disableBorderWidth: true,
                      disableBorderStyle: true,
                      disableBorderRadius: true
                    }
                  }
                ],
                target: '.ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner:after'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: '禁用',
            items: [
              {
                title: '选择框',
                options: [
                  { type: 'border', config: { useImportant: true } },
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'opacity'
                ],
                target: '.ant-checkbox.ant-checkbox-disabled .ant-checkbox-inner'
              },
              {
                title: '全选框',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'border'
                ],
                target: '.checkbox > .ant-checkbox-wrapper-disabled'
              },
              {
                title: '选项',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  'border'
                ],
                target: '.ant-checkbox-group>.ant-checkbox-wrapper-disabled'
              },
              {
                title: '选择框勾选符号',
                options: [
                  {
                    type: 'border',
                    config: {
                      disableBorderWidth: true,
                      disableBorderStyle: true,
                      disableBorderRadius: true
                    }
                  }
                ],
                target: '.ant-checkbox.ant-checkbox-disabled .ant-checkbox-inner:after'
              },
              {
                title: '选项标签',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target:
                  'label.ant-checkbox-wrapper.ant-checkbox-wrapper-disabled > span:nth-child(2)'
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
          title: '全选框',
          type: 'switch',
          description: '是否使用全选框',
          value: {
            get({ data }) {
              return data.checkAll;
            },
            set({ data }, value: boolean) {
              data.checkAll = value;
            }
          }
        },
        {
          title: '全选框默认选中',
          type: 'switch',
          description: '是否默认选中全选框,开启后，设置选项或初始状态，都为全选状态',
          value: {
            get({ data }) {
              return data.defaultCheckedAll;
            },
            set({ data }, value: boolean) {
              data.defaultCheckedAll = value;
            }
          }
        },
        {
          title: '全选框标签',
          type: 'text',
          options: {
            locale: true
          },
          description: '修改全选框的文案',
          ifVisible({ data }: EditorResult<Data>) {
            return data.checkAll;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.checkAllText;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.checkAllText = value;
            }
          }
        },
        {
          title: '全选框可控',
          type: 'switch',
          description: '全选框样式配置',
          ifVisible({ data }: EditorResult<Data>) {
            return data.checkAll;
          },
          value: {
            get({ data }) {
              return data.isIndeterminate;
            },
            set({ data, input, output }, value: "partChecked" | "unChecked" | "allChecked") {
              const event = input.get("setIndeterminate");
              const schema = {
                type: "enum",
                items: [
                  {
                    type: "string",
                    value: "partChecked"
                  },
                  {
                    type: "string",
                    value: "unChecked"
                  },
                  {
                    type: "string",
                    value: "allChecked"
                  }
                ]
              }
              if (value) {
                !event && input.add("setIndeterminate", "设置全选框状态", schema);
                
                !output.get("setIndeterminateDone") &&
                output.add("setIndeterminateDone", '设置全选框状态完成', schema);

                input.get("setIndeterminate").setRels(["setIndeterminateDone"]);
              } else {
                event && input.remove("setIndeterminate");
                output.get("setIndeterminateDone") && output.remove("setIndeterminateDone");
              }
              data.isIndeterminate = value;
              
            }
          }
        },
        // 选项配置
        {
          title: '静态选项配置',
          type: 'array',
          options: {
            getTitle: ({ label, checked }) => {
              return `${env.i18n(label)}${checked ? ': 默认值' : ''}`;
            },
            onAdd: () => {
              const value = uuid('_', 2);
              const defaultOption = {
                label: `选项${value}`,
                value: `选项${value}`,
                type: 'default',
                key: uuid()
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
              return data.staticOptions;
            },
            set({ data, focusArea }: EditorResult<Data>, options: Option[]) {
              const values: any[] = [];
              let renderError = false;
              options.forEach(({ checked, value }) => {
                if (checked) values.push(value);
                if (value === undefined) renderError = true;
              });

              data.renderError = renderError;
              data.value = values as any;
              data.staticOptions = options;
              data.config.options = options;
            }
          }
        },
        {
          title: '禁止冒泡',
          description: '默认关闭，阻止多选框的点击事件冒泡',
          type:'switch',
          value: {
            get({ data }) {
              return data.eventBubble;
            },
           set({ data }, value: boolean) {
              data.eventBubble = value;
            }}
        },
        {
          title: '布局',
          description: '水平排列和垂直排列',
          type: 'select',
          options: [
            {
              label: '水平',
              value: 'horizontal'
            },
            {
              label: '垂直',
              value: 'vertical'
            }
          ],
          value: {
            get({ data }) {
              return data.layout;
            },
            set({ data }, value: boolean) {
              data.layout = value;
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
                options: {
                  locale: true
                },
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
            }
          ]
        }
      ];
    }
  },
  '[data-checkbox-idx]': {
    title: '选项',
    '@dblclick': {
      type: 'text',
      value: {
        get({ data, focusArea }) {
          if(!focusArea) return
          const { item } = getCheckBoxItemInfo(data, focusArea)
          return item.label
        },
        set({ data, focusArea, input, output }, value) {
          if(!focusArea) return
          const { item } = getCheckBoxItemInfo(data, focusArea)
          if(item.key === 'all') {
            data.checkAllText = value
            return
          }
          item.label = value
        }
      }
    },
    items: [
      {
        title: '标题',
        type: 'text',
        options: {
          locale: true
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if(!focusArea) return
          const { item } = getCheckBoxItemInfo(data, focusArea)
          return item.label
          },
          set({ data, focusArea }: EditorResult<Data>, val) {
            if(!focusArea) return
            const { item } = getCheckBoxItemInfo(data, focusArea)
            if(item.key === 'all') {
              data.checkAllText = val
              return
            }
            item.label = val
          }
        }
      },
    ]
  },
};

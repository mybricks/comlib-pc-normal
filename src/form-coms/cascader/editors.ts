import { OutputIds, SizeEnum, SizeOptions } from '../types';
import { createrCatelogEditor } from '../utils';
import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { Data } from './runtime';
import { refreshSchema } from './constants';

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
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-select-single.ant-select-show-arrow .ant-select-selection-item'
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-select-selection-placeholder'
              },
              {
                title: '边框',
                options: ['border'],
                target: 'div.ant-select:not(.ant-select-customize-input) > div.ant-select-selector'
              },
              {
                title: '背景色',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target: '.ant-select:not(.ant-select-customize-input) .ant-select-selector'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }, 'background'],
                target: '.ant-select-allow-clear .ant-select-clear'
              },
              {
                title: '下拉图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-select-arrow'
              },
              {
                title: '标签',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: ['.ant-select-multiple .ant-select-selection-item']
              },
              {
                title: '标签-关闭图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: ['.ant-select-multiple .ant-select-selection-item-remove']
              },
              {
                title: '下拉区域',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-cascader-menu`;
                }
              },
              {
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-cascader-menu-item`;
                }
              },
              {
                title: '多选节点',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-cascader-checkbox-inner`;
                }
              },
              {
                title: "展开图标",
                options: [
                  {
                    type: 'font',
                    config: {
                      disableFontFamily: true,
                      disableTextAlign: true,
                      disableFontWeight: true,
                      disableLineHeight: true,
                      disableLetterSpacing: true,
                      disableFontSize: true
                    }
                  },
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-cascader-menu-item-expand-icon`;
                }
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                catelog: 'Hover',
                title: '边框',
                options: ['border'],
                target:
                  'div.ant-select:not(.ant-select-customize-input) > div.ant-select-selector:hover',
                domTarget: 'div.ant-select-selector'
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
              },
              {
                catelog: 'Hover',
                title: '选项',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-cascader-menu-item:hover`;
                }
              },
              {
                catelog: 'Hover',
                title: '多选节点',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-cascader-checkbox-wrapper:hover .ant-cascader-checkbox-inner, .ant-cascader-checkbox:not(.ant-cascader-checkbox-checked):hover .ant-cascader-checkbox-inner`;
                }
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
                  return [
                    `.{id} .ant-cascader-menu-item-active:not(.ant-cascader-menu-item-disabled), .ant-cascader-menu-item-active:not(.ant-cascader-menu-item-disabled):hover`
                  ];
                }
              },
              {
                title: '多选节点',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                global: true,
                target({ id }: EditorResult<Data>) {
                  return `.{id} .ant-cascader-checkbox-checked .ant-cascader-checkbox-inner`;
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
    items: ({ data }: EditorResult<Data>, ...catalog) => {
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
          title: '多选节点',
          type: 'Switch',
          description: '是否要多选',
          value: {
            get({ data }) {
              return data.isMultiple;
            },
            set({ data }, value: boolean) {
              data.isMultiple = value;
            }
          }
        },
        {
          title: '输出选中节点及所有子节点的值',
          type: 'Switch',
          description:
            '默认情况下，级联选择器选中父节点后，只会包含父节点的key；如果需要级联选择的值中包含所有子节点的值，类似于["父-key", "子节点-key"]的结构，可以勾选',
          ifVisible({ data }) {
            return data.isMultiple;
          },
          value: {
            get({ data }) {
              return data.isCheckAutoWithChildren;
            },
            set({ data }, value: boolean) {
              data.isCheckAutoWithChildren = value;
            }
          }
        },
        //选择自适应还是自选择点数
        {
          title: '节点数配置',
          type: 'Select',
          description: '多选结点是自适应还是自定义',
          ifVisible({ data }) {
            return data.isMultiple;
          },
          options: [
            {
              label: '自适应',
              value: 'isResponsive'
            },
            {
              label: '自定义',
              value: 'isCustom'
            }
          ],
          value: {
            get({ data }) {
              if (!data.maxTagCountType) {
                data.maxTagCountType = 'isResponsive';
              }
              return data.maxTagCountType;
            },
            set({ data }, value: string) {
              data.maxTagCountType = value;
              if (data.maxTagCountType == 'isResponsive') {
                data.config.maxTagCount = 'responsive';
              }
            }
          }
        },
        //输入框显示的最多节点数
        {
          title: '多选节点数',
          type: 'Slider',
          description: '输入框中显示的节点数',
          ifVisible({ data }) {
            return data.isMultiple && data.maxTagCountType === 'isCustom';
          },
          options: {
            max: 10,
            min: 1,
            steps: 1,
            formatter: '/10'
          },
          value: {
            get({ data }) {
              if (!data.config.maxTagCount) {
                data.config.maxTagCount = 1;
              }
              return data.config.maxTagCount;
            },
            set({ data }, value: number) {
              data.config.maxTagCount = value;
            }
          }
        },
        {
          title: '允许选择任意一级',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.config.changeOnSelect;
            },
            set({ data }, value: boolean) {
              data.config.changeOnSelect = value;
            }
          }
        },
        {
          title: '支持搜索',
          type: 'Switch',
          description: '开启后可输入内容搜索',
          value: {
            get({ data }) {
              return data.config.showSearch;
            },
            set({ data }, value: boolean) {
              data.config.showSearch = value;
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
              description: '通过给级联选择的输入项「设置初始值」设置数据；或者给级联所在的表单容器，通过表单容器的输入项「设置表单数据」设置数据，触发「值初始化」输出项事件，输出内容为级联当前值。值初始化只是设置级联选择的值，和设置级联的选项（数据源）没有关系',
              options: {
                outputId: 'onInitial'
              }
            },
            {
              title: '值更新',
              type: '_event',
              description: '通过给级联选择的输入项「设置值」设置数据；给级联所在的表单容器，通过表单容器的输入项「设置表单数据(触发值变化)」设置数据；或用户操作级联选择的增删改操作时；，触发「值更新」输出项事件，输出内容为级联当前值。值更新只是设置级联选择的值，和设置级联的选项（数据源）没有关系',
              options: {
                outputId: 'onChange'
              }
            }
          ]
        }
      ];

      catalog[1].title = '高级';
      catalog[1].items = [
        {
          title: '字段配置',
          items: [
            {
              title: '名称字段 label',
              type: 'Text',
              options: {
                placeholder: '默认值为 label'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data?.fieldNames?.label;
                },
                set(props: EditorResult<Data>, label: string) {
                  data.fieldNames.label = label;
                  refreshSchema(props);
                }
              }
            },
            {
              title: '值字段 value',
              type: 'Text',
              description: '所有项数据的值字段在整个数据源范围内不能重复',
              options: {
                placeholder: '数据的唯一标识字段，默认值为 value'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data?.fieldNames?.value;
                },
                set(props: EditorResult<Data>, value: string) {
                  data.fieldNames.value = value;
                  refreshSchema(props);
                }
              }
            },
            {
              title: '子项字段 children',
              type: 'Text',
              options: {
                placeholder: '默认值为 children'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data?.fieldNames?.children;
                },
                set(props: EditorResult<Data>, value: string) {
                  data.fieldNames.children = value;
                  refreshSchema(props);
                }
              }
            }
          ]
        },
        {
          title: '异步加载',
          items: [
            {
              title: '异步加载',
              type: 'Switch',
              description: '开启后可配置子节点异步加载',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.useLoadData;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.useLoadData = value;
                }
              }
            },
            {
              title: '异步加载输出',
              type: '_event',
              ifVisible({ data }: EditorResult<Data>) {
                return data.useLoadData
              },
              options: {
                outputId: 'loadData'
              }
            }
          ]
        },
        
      ]
    }
  }
};

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};

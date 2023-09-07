import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { Data, IconType } from './types';
import TreeSelectEditors from './treeSelectEditors';
import { createrCatelogEditor } from '../utils';

const getSuggestions = (data: Data) => {
  return [
    {
      label: 'node',
      insertText: `node.`,
      detail: `当前节点`,
      properties: [
        {
          label: '_depth',
          insertText: `{_depth}`,
          detail: `当前节点的深度`
        },
        {
          label: 'isLeaf',
          insertText: `{isLeaf}`,
          detail: `当前节点是否为叶子节点`
        },
        {
          label: data.valueFieldName || 'value',
          insertText: `{${data.valueFieldName || 'value'}}` + ' === ',
          detail: `当前节点${data.valueFieldName || 'value'}值`
        },
        {
          label: data.labelFieldName || 'label',
          insertText: `{${data.labelFieldName || 'label'}}` + ' === ',
          detail: `当前节点${data.labelFieldName || 'label'}值`
        },
        {
          label: data.childrenFieldName || 'children',
          insertText: `{${data.childrenFieldName || 'children'}}` + ' === ',
          detail: `当前节点${data.childrenFieldName || 'children'}值`
        },
      ]
    },
  ];
}

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  ':root': {
    style: [
      ...createrCatelogEditor({
        catelog: '默认',
        items: [
          {
            title: '输入框',
            options: ['border', 'font'],
            target: '.ant-select-selector'
          },
          {
            title: '选项',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            global: true,
            target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-node-content-wrapper`
          },
          {
            title: '勾选框',
            ifVisible({ data }: EditorResult<Data>) {
              return data.config.multiple;
            },
            options: [
              'border',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            global: true,
            target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-checkbox .ant-select-tree-checkbox-inner`
          },
        ]
      }),
      ...createrCatelogEditor({
        catelog: 'Hover',
        items: [
          {
            title: '输入框',
            options: ['border'],
            target: 'div.ant-select:not(.ant-select-customize-input) > div.ant-select-selector:hover',
            domTarget: 'div.ant-select-selector'
          },
          {
            title: '选项',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            global: true,
            target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-node-content-wrapper:hover`,
            domTarget: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-node-content-wrapper`
          },
          {
            title: '勾选框选中',
            ifVisible({ data }: EditorResult<Data>) {
              return data.config.multiple;
            },
            options: [
              'border',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            global: true,
            target: `.{id} .ant-select-tree-treenode .ant-select-tree-checkbox.ant-select-tree-checkbox-checked:after`
          },
        ]
      }),
      ...createrCatelogEditor({
        catelog: 'Focus',
        items: [
          {
            title: '输入框',
            options: ['border', 'BoxShadow'],
            target: 'div.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) > div.ant-select-selector',
            domTarget: 'div.ant-select-selector'
          },
        ]
      }),
      ...createrCatelogEditor({
        catelog: 'Select',
        items: [
          {
            title: '选项',
            ifVisible({ data }: EditorResult<Data>) {
              return !data.config.multiple;
            },
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            global: true,
            target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-node-content-wrapper.ant-select-tree-node-selected`
          },
        ]
      }),
      ...createrCatelogEditor({
        catelog: 'Check',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.config.multiple;
        },
        items: [
          {
            title: '选项',
            options: [
              { type: 'font', config: { disableTextAlign: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            global: true,
            target: `.{id} .ant-select-tree .ant-select-tree-treenode.ant-select-tree-treenode-checkbox-checked .ant-select-tree-node-content-wrapper`
          },
          {
            title: '勾选框',
            options: [
              'border',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            global: true,
            target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-checkbox.ant-select-tree-checkbox-checked .ant-select-tree-checkbox-inner`,
          },
        ]
      }),
      ...createrCatelogEditor({
        catelog: '禁用',
        items: [
          {
            title: '勾选框',
            ifVisible({ data }: EditorResult<Data>) {
              return data.config.multiple;
            },
            options: [
              { type: 'border', config: { useImportant: true } },
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            global: true,
            target: `.{id} .ant-select-tree .ant-select-tree-treenode .ant-select-tree-checkbox.ant-select-tree-checkbox-checked.ant-select-tree-checkbox-disabled .ant-select-tree-checkbox-inner`,
          },
        ]
      })
    ],
    items: ({ data }: EditorResult<Data>, ...catalog) => {
      catalog[0].title = '常规';
      catalog[0].items = [
        {
          title: '提示内容',
          type: 'Text',
          description: '该提示内容会在值为空时显示',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.config.placeholder;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.config.placeholder = value;
            }
          }
        },
        {
          title: '显示清除图标',
          type: 'switch',
          description: '可以点击清除图标删除内容',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.config.allowClear;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.config.allowClear = value;
            }
          }
        },
        {
          title: '禁用状态',
          type: 'switch',
          description: '是否禁用状态',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.config.disabled;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.config.disabled = value;
            }
          }
        },
        ...TreeSelectEditors,
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
          ]
        }
      ];

      catalog[1].title = '高级'
      catalog[1].items = [
        {
          title: '标题字段',
          type: 'Text',
          options: {
            placeholder: '默认值为 label'
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.labelFieldName
            },
            set({ data, input, output }: EditorResult<Data>, value: string) {
              data.labelFieldName = value
              refreshSchema(data, input, output)
            }
          }
        },
        {
          title: '值字段',
          type: 'Text',
          options: {
            placeholder: '默认值为 value'
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.valueFieldName
            },
            set({ data, input, output }: EditorResult<Data>, value: string) {
              data.valueFieldName = value
              refreshSchema(data, input, output)
            }
          }
        },
        {
          title: '叶子节点字段',
          type: 'Text',
          options: {
            placeholder: '默认值为 children'
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.childrenFieldName
            },
            set({ data, input, output }: EditorResult<Data>, value: string) {
              data.childrenFieldName = value
              refreshSchema(data, input, output)
            }
          }
        },
        {
          title: '节点图标',
          type: 'array',
          description: `图标动态显示表达式约定以“node”开头, node表示当前节点, 如{node._depth===0}: 当前节点为根节点时显示`,
          options: {
            addText: '添加图标',
            editable: true,
            getTitle(item) {
              return `${item.title} ${item.displayExpression}`;
            },
            onAdd(): IconType {
              return {
                title: '图标',
                src: 'inner',
                size: [14, 14],
                gutter: [8],
                innerIcon: 'FolderOpenOutlined',
                displayRule: 'default',
                customIcon: '',
                displayExpression: ''
              };
            },
            items: [
              {
                title: '名称',
                type: 'text',
                value: 'title'
              },
              {
                title: '尺寸',
                type: 'InputNumber',
                options: [
                  { title: '高度', min: 0, width: 100 },
                  { title: '宽度', min: 0, width: 100 }
                ],
                value: 'size'
              },
              // {
              //   title: '间隔',
              //   type: 'InputNumber',
              //   options: [
              //     { min: 0, width: 100 },
              //   ],
              //   value: 'gutter'
              // },
              {
                title: '图标来源',
                type: 'Radio',
                options: [
                  { label: '无', value: false },
                  { label: '内置图标库', value: 'inner' },
                  { label: '自定义上传', value: 'custom' }
                ],
                value: 'src'
              },
              {
                title: '图标库',
                type: 'Icon',
                ifVisible(item: any) {
                  return item.src === 'inner';
                },
                value: 'innerIcon'
              },
              {
                title: '上传',
                type: 'ImageSelector',
                ifVisible(item: any) {
                  return item.src === 'custom';
                },
                value: 'customIcon'
              },
              {
                title: '应用节点',
                type: 'Radio',
                options: [
                  { label: '所有节点', value: 'default' },
                  { label: '自定义节点', value: 'dynamic' }
                ],
                value: 'displayRule'
              },
              {
                title: '动态显示表达式',
                type: 'expression',
                options: {
                  suggestions: getSuggestions(data),
                  placeholder: `例：{node._depth===0} 图标应用在根节点上`,
                },
                ifVisible(item: any) {
                  return item.displayRule === 'dynamic';
                },
                value: 'displayExpression',
              }
            ]
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return [...(data.icons || [])];
            },
            set({ data }: EditorResult<Data>, val: Array<IconType>) {
              data.icons = val;
            }
          }
        },
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
          title: '仅首次加载',
          type: 'Switch',
          description: '关闭后，每次展开节点，都会重新触发异步加载',
          ifVisible({ data }: EditorResult<Data>) {
            return data.useLoadData
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.loadDataOnce;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.loadDataOnce = value;
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
        },
      ];

    }
  }
}

const refreshSchema = (data: Data, input, output) => {

  const trueValueFieldName = data.valueFieldName || 'value';
  const trueLabelFieldName = data.labelFieldName || 'label';
  const trurChildrenFieldName = data.childrenFieldName || 'children';

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        [trueLabelFieldName]: {
          title: '标签',
          type: 'string'
        },
        [trueValueFieldName]: {
          title: '值',
          type: 'string'
        },
        isLeaf: {
          title: '是否叶子节点',
          type: 'boolean'
        },
        [trurChildrenFieldName]: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object',
            properties: {}
          }
        }
      }
    }
  }

  const setOptionsPin = input.get('setOptions')
  const setLoadDataPin = input.get('setLoadData')
  const loadDataPin = output.get('loadData')

  if (setOptionsPin) {
    setOptionsPin.setSchema(schema)
  }

  if (setLoadDataPin) {
    setLoadDataPin.setSchema(schema.items)
  }

  if (loadDataPin) {
    loadDataPin.setSchema(schema.items)
  }
}
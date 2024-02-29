import { createrCatelogEditor } from '../form-coms/utils';
import { unitConversion, uuid } from '../utils';
import { actionBtnsEditor, actionBtnEditor, getBtnProp, styleEditor } from './actionBtnEditor';
import { commonActionBtnsEditor } from './actionBtnsCommonEditor';
import {
  Data,
  TreeData,
  MODIFY_BTN_ID,
  DELETE_BTN_ID,
  IconSrcType,
  IconType,
  ValueType
} from './types';
import { InputIds, OutputIds } from './constants';
import { getNodeSuggestions, refreshSchema, setCheckboxStatus } from './utils';

export default {
  '@resize': {
    options: ['width']
  },
  ':root': {
    title: '树组件',
    style: [
      {
        title: '显示连线',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.showLine;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.showLine = value;
          }
        }
      },
      {
        title: '紧凑模式',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.useCompactTheme;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.useCompactTheme = value;
          }
        }
      },
      {
        title: '可滚动高度',
        type: 'text',
        options: {
          placeholder: '例如：100px/100%/100vw/calc(100px)'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.scrollHeight;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.scrollHeight = unitConversion(value) || '';
          }
        }
      },
      {
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                title: '树组件样式',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  {
                    type: 'font',
                    config: {
                      disableFontFamily: true,
                      disableTextAlign: true,
                      disableColor: true,
                      disableFontWeight: true,
                      disableLetterSpacing: true,
                      disableWhiteSpace: true
                    }
                  }
                ],
                target: '.ant-tree'
              },
              {
                title: '缩进样式',
                options: [
                  {
                    type: 'size',
                    config: {
                      disableWidth: true
                    }
                  }
                ],
                target: '.ant-tree .ant-tree-treenode .ant-tree-indent'
              },
              {
                title: '缩进样式',
                options: [
                  {
                    type: 'size',
                    config: {
                      disableHeight: true
                    }
                  }
                ],
                target: '.ant-tree-indent-unit'
              },
              {
                title: '展开收起图标',
                options: [
                  {
                    type: 'size',
                    config: {
                      disableHeight: true
                    }
                  },
                  {
                    type: 'font',
                    config: {
                      disableFontSize: true,
                      disableFontFamily: true,
                      disableTextAlign: true,
                      disableColor: true,
                      disableFontWeight: true,
                      disableLetterSpacing: true,
                      disableWhiteSpace: true
                    }
                  }
                ],
                target: '.ant-tree-switcher'
              },
              {
                title: '树节点公共样式',
                options: ['padding'],
                target: '.ant-tree-treenode'
              },
              {
                title: '树节点公共样式',
                options: [
                  {
                    type: 'font',
                    config: {
                      disableTextAlign: true
                    }
                  },
                  'border',
                  {
                    type: 'background',
                    config: {
                      disableBackgroundImage: true
                    }
                  },
                  {
                    type: 'size',
                    config: {
                      disableWidth: true
                    }
                  }
                ],
                target: '.ant-tree-treenode > .ant-tree-node-content-wrapper'
              },
              {
                title: '节点标题公共样式',
                options: [
                  {
                    type: 'font',
                    config: {
                      disableTextAlign: true
                    }
                  }
                ],
                target:
                  '.ant-tree-treenode > .ant-tree-node-content-wrapper > .ant-tree-title .title'
              },
              {
                title: '空状态图片',
                options: [
                  'size',
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: ['.ant-empty-image > svg', '.ant-empty-image > img']
              },
              {
                title: '空状态文案',
                options: ['font'],
                target: [`.ant-empty-description`]
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                title: '树节点公共样式',
                options: [
                  {
                    type: 'font',
                    config: {
                      disableTextAlign: true
                    }
                  }
                ],
                target:
                  '.ant-tree-treenode > .ant-tree-node-content-wrapper:hover > .ant-tree-title .title'
              },
              {
                title: '树节点公共样式',
                options: [
                  'border',
                  {
                    type: 'background',
                    config: {
                      disableBackgroundImage: true
                    }
                  }
                ],
                target: '.ant-tree-treenode > .ant-tree-node-content-wrapper:hover'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Select',
            items: [
              {
                title: '树节点公共样式',
                options: [
                  {
                    type: 'font',
                    config: {
                      disableTextAlign: true
                    }
                  }
                ],
                target:
                  'div.ant-tree-treenode > .ant-tree-node-content-wrapper.ant-tree-node-selected > .ant-tree-title .title'
              },
              {
                title: '树节点公共样式',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target:
                  'div.ant-tree-treenode > .ant-tree-node-content-wrapper.ant-tree-node-selected'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Check',
            items: [
              {
                title: '树节点公共样式',
                options: [
                  {
                    type: 'font',
                    config: {
                      disableTextAlign: true
                    }
                  }
                ],
                target:
                  'div.ant-tree-treenode.ant-tree-treenode-checkbox-checked > span.ant-tree-node-content-wrapper > .ant-tree-title .title'
              },
              {
                title: '树节点公共样式',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target:
                  'div.ant-tree-treenode.ant-tree-treenode-checkbox-checked > span.ant-tree-node-content-wrapper'
              }
            ]
          })
        ]
      }
    ],
    items: ({ data, output }: EditorResult<Data>, ...cate) => {
      const suggestions = getNodeSuggestions(data);
      cate[0].title = '常规';
      cate[1].title = '高级';
      cate[0].items = [
        {
          title: '使用静态数据源',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useStaticData;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.useStaticData = value;
            }
          }
        },
        {
          type: 'Code',
          ifVisible({ data }: EditorResult<Data>) {
            return data.useStaticData;
          },
          options: {
            title: '编辑静态数据',
            language: 'json',
            width: 600,
            minimap: {
              enabled: false
            },
            displayType: 'button'
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.staticData;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.staticData = value;
            }
          }
        },
        {
          title: '配置',
          items: [
            {
              title: '标题字段',
              type: 'Text',
              options: {
                placeholder: '默认值为 title'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.titleFieldName;
                },
                set(props: EditorResult<Data>, value: string) {
                  data.titleFieldName = value;
                  refreshSchema(props);
                }
              }
            },
            {
              title: '标识字段',
              type: 'Text',
              description:
                '所有节点的标识字段值在整个树范围内不能重复。不填时会根据节点位置生成唯一标识，存储在key属性中。',
              options: {
                placeholder: '节点的唯一标识，默认值为 key'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.keyFieldName;
                },
                set(props: EditorResult<Data>, value: string) {
                  data.keyFieldName = value;
                  refreshSchema(props);
                }
              }
            },
            {
              title: '子节点字段',
              type: 'Text',
              options: {
                placeholder: '默认值为 children'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.childrenFieldName;
                },
                set(props: EditorResult<Data>, value: string) {
                  data.childrenFieldName = value;
                  refreshSchema(props);
                }
              }
            },
            {
              title: '输出数据',
              type: 'Radio',
              options: [
                {
                  label: '标识字段',
                  value: ValueType.KEY_FIELD
                },
                {
                  label: '节点数据',
                  value: ValueType.TREE_NODE
                }
              ],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.valueType;
                },
                set(props: EditorResult<Data>, value: string) {
                  data.valueType = value;
                  refreshSchema(props);
                }
              }
            },
            {
              title: '标题超出省略',
              type: 'switch',
              description:
                '内容超出宽度后文本是否自动省略、不换行、以省略号结尾，并悬浮显示完整内容',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.titleEllipsis;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.titleEllipsis = value;
                }
              }
            },
            {
              title: '默认展开深度',
              type: 'InputNumber',
              description: '0表示全部折叠, -1表示全部展开',
              options: [{ min: -1, max: 20, width: 100 }],
              value: {
                get({ data }: EditorResult<Data>) {
                  return [data.openDepth];
                },
                set({ data }: EditorResult<Data>, value: number[]) {
                  data.openDepth = value[0];
                }
              }
            },
            {
              title: '节点点击展开收起',
              type: 'Switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.clickExpandable;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.clickExpandable = value;
                }
              }
            }
          ]
        },
        {
          title: '空状态',
          items: [
            {
              title: '自定义空状态图片',
              type: 'switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.isImage;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.isImage = value;
                }
              }
            },
            {
              title: '图片地址',
              type: 'ImageSelector',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.isImage;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.image;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.image = value;
                }
              }
            },
            {
              title: '空状态文案',
              type: 'Text',
              description: '自定义描述内容',
              options: {
                placeholder: '自定义描述内容',
                locale: true
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.description;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.description = value;
                }
              }
            }
          ]
        },
        {
          title: '事件',
          items: [
            {
              title: '节点选中',
              type: '_Event',
              options: () => {
                return {
                  outputId: OutputIds.OnNodeClick
                };
              }
            },
            {
              title: '数据变化',
              type: '_Event',
              options: () => {
                return {
                  outputId: OutputIds.OnChange
                };
              }
            }
          ]
        }
      ];
      cate[1].items = [
        {
          title: '过滤功能',
          items: [
            {
              title: '过滤字段',
              type: 'Select',
              description: '配置树的过滤字段',
              options: {
                mode: 'tags',
                multiple: true,
                options: [
                  { label: '标题', value: 'byTitle' },
                  { label: '值', value: 'byKey' }
                ]
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.filterNames;
                },
                set({ data }: EditorResult<Data>, value: string[]) {
                  data.filterNames = value;
                }
              }
            }
          ]
        },
        {
          title: '禁用功能',
          items: [
            {
              title: '节点禁用表达式',
              description: `根据节点数据在运行时动态设置节点禁用的表达式，支持JS表达式语法, 例：{node.disabled}`,
              type: 'expression',
              options: {
                placeholder: `例：{node.disabled} 节点disabled为true时禁用`,
                suggestions
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.disabledScript;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.disabledScript = value;
                }
              }
            }
          ]
        },
        {
          title: '勾选功能',
          items: [
            {
              title: '支持勾选',
              type: 'Radio',
              options: [
                {
                  label: '不开启',
                  value: false
                },
                {
                  label: '全部节点',
                  value: true
                },
                {
                  label: '自定义节点',
                  value: 'custom'
                }
              ],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.checkable;
                },
                set({ data, input }: EditorResult<Data>, value: boolean | 'custom') {
                  data.checkable = value;
                  if (value && !input.get(InputIds.SetCheckedKeys)) {
                    input.add({
                      id: InputIds.SetCheckedKeys,
                      title: '设置勾选项',
                      schema: {
                        type: 'array',
                        items: {
                          title: '字段名',
                          type: 'string'
                        }
                      }
                    });
                    input.add({
                      id: InputIds.GetCheckedKeys,
                      title: '获取勾选项数据',
                      schema: {
                        type: 'any'
                      }
                    });
                    input.get(InputIds.GetCheckedKeys).setRels([InputIds.GetCheckedKeys]);
                    input.add({
                      id: InputIds.SetDisableCheckbox,
                      title: '禁用勾选框',
                      schema: {
                        type: 'any'
                      }
                    });
                    input.add({
                      id: InputIds.SetEnableCheckbox,
                      title: '启用勾选框',
                      schema: {
                        type: 'any'
                      }
                    });

                    output.add({
                      id: 'setCheckedKeysDone',
                      title: '设置勾选项完成',
                      schema: {
                        type: 'array',
                        items: {
                          title: '字段名',
                          type: 'string'
                        }
                      }
                    });
                    output.add({
                      id: 'setDisableCheckboxDone',
                      title: '禁用勾选框完成',
                      schema: {
                        type: 'any'
                      }
                    });
                    output.add({
                      id: 'setEnableCheckboxDone',
                      title: '启用勾选框完成',
                      schema: {
                        type: 'any'
                      }
                    });

                    input.get(InputIds.SetCheckedKeys).setRels(['setCheckedKeysDone']);
                    input.get(InputIds.SetDisableCheckbox).setRels(['setDisableCheckboxDone']);
                    input.get(InputIds.SetEnableCheckbox).setRels(['setEnableCheckboxDone']);
                  } else {
                    input.remove(InputIds.SetCheckedKeys);
                    input.remove(InputIds.GetCheckedKeys);
                    input.remove(InputIds.SetDisableCheckbox);
                    input.remove(InputIds.SetEnableCheckbox);

                    output.remove('setCheckedKeysDone');
                    output.remove('setDisableCheckboxDone');
                    output.remove('setEnableCheckboxDone');
                  }
                }
              }
            },
            {
              title: '节点可勾选表达式',
              description: `根据节点数据在运行时动态显示节点勾选框的表达式，支持JS表达式语法, 例：{node.checkable}`,
              type: 'expression',
              ifVisible({ data }: EditorResult<Data>) {
                return data.checkable === 'custom';
              },
              options: {
                placeholder: `例：{node.checkable} 节点checkabled为true时显示勾选框`,
                suggestions
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.checkableScript;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.checkableScript = value;
                }
              }
            },
            {
              title: '勾选事件',
              type: 'Switch',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.checkable;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.useCheckEvent;
                },
                set(props: EditorResult<Data>, val) {
                  if (val) {
                    output.add(OutputIds.OnCheck, '勾选事件', {
                      title: '勾选项数据',
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    });
                    refreshSchema(props);
                  } else {
                    output.remove(OutputIds.OnCheck);
                  }
                  data.useCheckEvent = val;
                }
              }
            },
            {
              title: '勾选事件',
              type: '_Event',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.checkable && data.useCheckEvent;
              },
              options: () => {
                return {
                  outputId: OutputIds.OnCheck
                };
              }
            },
            {
              title: '父子节点勾选联动',
              type: 'Switch',
              description: '关闭后，可以单独勾选父节点，子节点不再被联动选择。',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.checkable;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return !data.checkStrictly;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.checkStrictly = !value;
                }
              }
            },
            {
              title: '禁用勾选框',
              type: 'Switch',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.checkable;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.disableCheckbox;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  setCheckboxStatus({ treeData: data.treeData, value });
                  data.disableCheckbox = value;
                }
              }
            },
            {
              title: '输出父节点信息',
              type: 'Switch',
              ifVisible({ data }: EditorResult<Data>) {
                return data.checkable && !data.checkStrictly;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.outParentKeys;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.outParentKeys = value;
                }
              }
            }
          ]
        },
        {
          title: '拖拽功能',
          items: [
            {
              title: '支持拖拽',
              type: 'Radio',
              options: [
                {
                  label: '不开启',
                  value: false
                },
                {
                  label: '全部节点',
                  value: true
                },
                {
                  label: '自定义节点',
                  value: 'custom'
                }
              ],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.draggable;
                },
                set(props: EditorResult<Data>, value: boolean | 'custom') {
                  data.draggable = value;
                  if (!!data.draggable && data.allowDrop === undefined) {
                    data.allowDrop = true;
                  }
                }
              }
            },
            {
              title: '节点可拖拽表达式',
              description: `根据节点数据在运行时动态计算节点是否可拖拽的表达式，支持JS表达式语法, 例：{node.draggable}`,
              type: 'expression',
              ifVisible({ data }: EditorResult<Data>) {
                return data.draggable === 'custom';
              },
              options: {
                placeholder: `例：{node.isLeaf} 节点isLeaf属性为true时可拖拽`,
                suggestions
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.draggableScript;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.draggableScript = value;
                }
              }
            },
            {
              title: '支持放置',
              type: 'Radio',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.draggable;
              },
              options: [
                {
                  label: '不开启',
                  value: false
                },
                {
                  label: '全部节点',
                  value: true
                },
                {
                  label: '自定义节点',
                  value: 'custom'
                }
              ],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.allowDrop;
                },
                set({ data }: EditorResult<Data>, value: boolean | 'custom') {
                  data.allowDrop = value;
                }
              }
            },
            {
              title: '节点可放置表达式',
              description: `根据节点数据在运行时动态计算节点上下是否可放置节点的表达式，支持JS表达式语法, 例：{node.isLeaf}`,
              type: 'expression',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.draggable && data.allowDrop === 'custom';
              },
              options: {
                placeholder: `例：{node.isLeaf} 节点isLeaf属性为true时可放置拖拽的节点`,
                suggestions
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.allowDropScript;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.allowDropScript = value;
                }
              }
            },
            {
              title: '放置范围限制',
              type: 'Radio',
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.draggable;
              },
              options: [
                {
                  label: '任意',
                  value: false
                },
                {
                  label: '当前父节点',
                  value: 'parent'
                }
              ],
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.useDropScope;
                },
                set({ data }: EditorResult<Data>, value: boolean | 'parent') {
                  data.useDropScope = value;
                }
              }
            },
            {
              title: '禁止放置提示语',
              type: 'text',
              options: {
                placeholder: '不满足放置范围限制时的提示语',
                locale: true
              },
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.useDropScope;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.dropScopeMessage;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.dropScopeMessage = value;
                }
              }
            },
            {
              title: '拖拽完成',
              type: '_Event',
              options: () => {
                return {
                  outputId: OutputIds.OnDropDone
                };
              }
            }
          ]
        },
        {
          title: '节点图标',
          items: [
            {
              type: 'array',
              description: `图标动态显示表达式约定以“node”开头, node表示当前节点, 如{node.isLeaf}: 当前节点为叶子节点时显示`,
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
                  {
                    title: '间隔',
                    type: 'InputNumber',
                    options: [{ min: 0, width: 100 }],
                    value: 'gutter'
                  },
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
                      suggestions,
                      placeholder: `例：{node.isLeaf} 图标应用在叶子节点上`
                    },
                    ifVisible(item: any) {
                      return item.displayRule === 'dynamic';
                    },
                    value: 'displayExpression'
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
            }
          ]
        },
        {
          title: '节点操作项',
          items: [
            {
              title: '节点操作项',
              type: 'Switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.useActions;
                },
                set({ data, output }: EditorResult<Data>, value: boolean) {
                  data.useActions = value;
                  if (value && !data?.actionBtns?.length) {
                    data.actionBtns = [
                      {
                        type: 'link',
                        title: '修改',
                        size: 'middle',
                        id: 'modify',
                        iconConfig: {
                          src: false,
                          size: [14, 14],
                          gutter: 8
                        }
                      },
                      {
                        type: 'link',
                        title: '删除',
                        size: 'middle',
                        id: 'delete',
                        iconConfig: {
                          src: false,
                          size: [14, 14],
                          gutter: 8
                        }
                      }
                    ];
                    const schema = {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string'
                        },
                        depth: {
                          type: 'number'
                        }
                      }
                    };
                    !output.get(MODIFY_BTN_ID) && output.add(MODIFY_BTN_ID, '修改', schema);
                    !output.get(DELETE_BTN_ID) && output.add(DELETE_BTN_ID, '删除', schema);
                  }
                }
              }
            },
            commonActionBtnsEditor(data, output),
            {
              title: '可添加节点',
              description: '开启后，树组件支持添加节点功能',
              type: 'Switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.addable;
                },
                set({ data, input }: EditorResult<Data>, value: boolean) {
                  data.addable = value;
                  if (value) {
                    input.add('addTips', '设置添加提示文案', {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    });
                    output.add('addTipsDone', '设置添加提示文案完成', {
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    });
                    input.get('addTips').setRels(['addTipsDone']);
                  } else {
                    input.remove('addTips');
                  }
                }
              }
            },
            {
              title: '支持添加节点的最大深度',
              type: 'InputNumber',
              description: '设置允许添加节点的最大深度，0表示不限制',
              options: [{ min: 0, width: 100 }],
              ifVisible({ data }: EditorResult<Data>) {
                return data.addable;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return [data.maxDepth];
                },
                set({ data }: EditorResult<Data>, value: number[]) {
                  data.maxDepth = value[0];
                }
              }
            },
            {
              title: '添加完成',
              type: '_Event',
              ifVisible({ data }: EditorResult<Data>) {
                return data.addable;
              },
              options: () => {
                return {
                  outputId: 'addNodeDone'
                };
              }
            }
          ]
        }
      ];
    }
  },
  '[data-tree-node-id]': {
    title: '树节点配置项',
    style: [
      {
        title: '当前节点样式',
        options: [
          {
            type: 'font',
            config: {
              disableTextAlign: true
            }
          }
        ],
        target: ({ focusArea, data }: EditorResult<Data>) => {
          return `div.ant-tree-treenode[data-tree-node-id="${focusArea.dataset.treeNodeId}"] > span.ant-tree-node-content-wrapper > .ant-tree-title .title `;
        }
      }
    ],
    items: []
  },
  '[data-action-btns]': actionBtnsEditor,
  '[data-btn-id]': {
    title: '操作',
    style: [
      ...styleEditor,
      {
        items: [
          {
            options: ['size'],
            catelog: '默认',
            target({ data, focusArea }) {
              const id = getBtnProp(data, focusArea, 'btnId', 'id');
              return `div[data-btn-id="${id}"] > button`;
            }
          },
          {
            title: '按钮样式',
            catelog: '默认',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ data, focusArea }) {
              const id = getBtnProp(data, focusArea, 'btnId', 'id');
              return `div[data-btn-id="${id}"] > button`;
            }
          },
          {
            title: '按钮样式',
            catelog: 'Hover',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ data, focusArea }) {
              const id = getBtnProp(data, focusArea, 'btnId', 'id');
              return `div[data-btn-id="${id}"] > button.ant-btn:not([disabled]):hover`;
            }
          },
          {
            title: '按钮样式',
            catelog: '激活',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ data, focusArea }) {
              const id = getBtnProp(data, focusArea, 'btnId', 'id');
              return `div[data-btn-id="${id}"] > button.ant-btn:not([disabled]):active`;
            }
          },
          {
            title: '按钮样式',
            catelog: '禁用',
            options: ['border', { type: 'font', config: { disableTextAlign: true } }, 'background'],
            target({ data, focusArea }) {
              const id = getBtnProp(data, focusArea, 'btnId', 'id');
              // TODO: 由于子作用域组件无法使用数组型 target，暂且通过 #{id} 的形式绕过去
              return `div[data-btn-id="${id}"] > button.ant-btn[disabled]`;
            }
          }
        ]
      }
    ],
    items: ({ data, focusArea }: EditorResult<Data>, cate1, cate2, cate3) => {
      if (!focusArea) return;
      const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
      const cates = actionBtnEditor(btn, data);
      cate1.title = cates[0].title;
      cate1.items = cates[0].items;
      cate2.title = cates[1].title;
      cate2.items = cates[1].items;
      // cate3.title = cates[2].title;
      // cate3.items = cates[2].items;
    }
  }
};

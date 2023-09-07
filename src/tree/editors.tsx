import { createrCatelogEditor } from '../form-coms/utils';
import { uuid } from '../utils';
import { actionBtnsEditor, actionBtnEditor, getBtnProp } from './actionBtnEditor';
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
import { OutputIds } from './constants';
import {
  getNodeSuggestions,
  refreshSchema,
  pretreatTreeData,
  setCheckboxStatus,
  traverseTree
} from './utils';

const buildNewNode = (uuid: string) => {
  return {
    title: uuid,
    value: uuid,
    key: uuid,
    children: []
  } as TreeData;
};

const getItemProp = ({
  data,
  focusArea,
  dataset,
  val,
  isParent = false
}: {
  data: Data;
  focusArea: any;
  dataset: any;
  val: string;
  isParent?: boolean;
}) => {
  if (!focusArea) return;
  const key: string = focusArea.dataset[dataset];
  const { node, parent } =
    traverseTree({
      data,
      targetKey: key,
      isEdit: true
    }) || {};
  const item = isParent ? parent : node;
  if (val === 'obj') return item;
  else return item[val];
};

const moveNode = ({ data, focusArea, isDown }: { data: Data; focusArea: any; isDown: boolean }) => {
  const key: string = focusArea.dataset['treeNodeId'];
  const keyFieldName = 'key';
  const index = data.treeData.findIndex((item) => item[keyFieldName] === key);
  if (index !== -1) {
    const target = data.treeData.splice(index, 1)[0];
    if (isDown) {
      data.treeData.splice(index + 1, 0, target);
    } else {
      data.treeData.splice(index - 1, 0, target);
    }
  } else {
    const parent: TreeData = getItemProp({
      data,
      focusArea,
      dataset: 'treeNodeId',
      val: 'obj',
      isParent: true
    });
    if (parent && parent.children) {
      const chileIndex = parent.children.findIndex((item) => item[keyFieldName] === key);
      const child = parent.children.splice(chileIndex, 1)[0];
      if (isDown) {
        parent.children.splice(chileIndex + 1, 0, child);
      } else {
        parent.children.splice(chileIndex - 1, 0, child);
      }
    }
  }
};

export default {
  '@init': ({ data }: EditorResult<Data>) => {
    pretreatTreeData({ treeData: data.treeData, data, defaultExpandAll: true });
    setCheckboxStatus({ treeData: data.treeData, value: false });
  },
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
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                title: '树组件样式',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-tree'
              },
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
                  '.ant-tree-treenode > .ant-tree-node-content-wrapper > .ant-tree-title .title'
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
                target: '.ant-tree-treenode > .ant-tree-node-content-wrapper'
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
            ifVisible: ({ data }: EditorResult<Data>) => {
              return !!data.checkable;
            },
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
              title: '默认展开',
              type: 'switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.defaultExpandAll;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.defaultExpandAll = value;
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
          title: '添加节点',
          type: 'button',
          value: {
            set({ data }: EditorResult<Data>) {
              const newChildNode = buildNewNode(uuid());
              data.treeData.push(newChildNode);
            }
          }
        },
        {
          title: '事件',
          items: [
            {
              title: '节点点击',
              type: '_Event',
              options: () => {
                return {
                  outputId: OutputIds.NODE_CLICK
                };
              }
            }
          ]
        }
      ];
      cate[1].items = [
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
                set({ data }: EditorResult<Data>, value: boolean | 'custom') {
                  data.checkable = value;
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
                    output.add(OutputIds.ON_CHECK, '勾选事件', {
                      title: '勾选项数据',
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    });
                    refreshSchema(props);
                  } else {
                    output.remove(OutputIds.ON_CHECK);
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
                  outputId: OutputIds.ON_CHECK
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
                  if (!!data.draggable) {
                    if (data.allowDrop === undefined) {
                      data.allowDrop = true;
                    }
                    output.add(OutputIds.ON_DROP_DONE, '拖拽完成', {
                      type: 'object'
                    });
                    refreshSchema(props);
                  } else {
                    output.remove(OutputIds.ON_DROP_DONE);
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
                placeholder: '不满足放置范围限制时的提示语'
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
              ifVisible({ data }: EditorResult<Data>) {
                return !!data.draggable;
              },
              options: () => {
                return {
                  outputId: OutputIds.ON_DROP_DONE
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
              title: '添加节点',
              description: '开启后，树组件支持添加节点功能',
              type: 'Switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.addable;
                },
                set({ data }: EditorResult<Data>, value: boolean) {
                  data.addable = value;
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
    items: [
      {
        title: '标题',
        type: 'text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getItemProp({
              data,
              focusArea,
              dataset: 'treeNodeId',
              val: 'title'
            });
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const item = getItemProp({
              data,
              focusArea,
              dataset: 'treeNodeId',
              val: 'obj'
            });
            item.title = value;
          }
        }
      },
      {
        title: '值',
        type: 'text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getItemProp({
              data,
              focusArea,
              dataset: 'treeNodeId',
              val: 'value'
            });
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const item = getItemProp({
              data,
              focusArea,
              dataset: 'treeNodeId',
              val: 'obj'
            });
            item.value = value;
          }
        }
      },
      {
        title: '添加子节点',
        type: 'button',
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            const target: TreeData = getItemProp({
              data,
              focusArea,
              dataset: 'treeNodeId',
              val: 'obj'
            });

            const newChildNode = buildNewNode(uuid());
            if (target.children) {
              target.children.push(newChildNode);
            } else {
              target.children = [newChildNode];
            }
          }
        }
      },
      {
        title: '上移',
        type: 'button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const key: string = focusArea.dataset['treeNodeId'];
          const keyFieldName = 'key';
          const index = data.treeData.findIndex((item) => item[keyFieldName] === key);
          if (index === 0) {
            return false;
          }
          if (index === -1) {
            const parent: TreeData = getItemProp({
              data,
              focusArea,
              dataset: 'treeNodeId',
              val: 'obj',
              isParent: true
            });
            if (parent && parent.children?.[0]?.[keyFieldName] === key) return false;
          }
          return true;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            moveNode({ data, focusArea, isDown: false });
          }
        }
      },
      {
        title: '下移',
        type: 'button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const key: string = focusArea.dataset['treeNodeId'];
          const keyFieldName = 'key';
          const index = data.treeData.findIndex((item) => item[keyFieldName] === key);
          if (index === data.treeData.length - 1) {
            return false;
          }
          if (index === -1) {
            const parent: TreeData = getItemProp({
              data,
              focusArea,
              dataset: 'treeNodeId',
              val: 'obj',
              isParent: true
            });
            if (parent && parent.children?.[parent.children.length - 1]?.[keyFieldName] === key)
              return false;
          }
          return true;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            moveNode({ data, focusArea, isDown: true });
          }
        }
      },
      {
        title: '删除节点',
        type: 'button',
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            const key: string = focusArea.dataset['treeNodeId'];
            const keyFieldName = 'key';
            const index = data.treeData.findIndex((item) => item[keyFieldName] === key);
            if (index !== -1) {
              data.treeData.splice(index, 1);
            } else {
              const parent: TreeData = getItemProp({
                data,
                focusArea,
                dataset: 'treeNodeId',
                val: 'obj',
                isParent: true
              });
              if (Array.isArray(parent.children)) {
                const index = parent.children.findIndex((item) => item[keyFieldName] === key);
                index !== -1 && parent.children.splice(index, 1);
              }
            }
          }
        }
      },
      {
        title: '删除所有子节点',
        type: 'button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const keyFieldName = 'key';
          const key: string = focusArea.dataset['treeNodeId'];
          const index = data.treeData.findIndex((item) => item[keyFieldName] === key);
          let target: TreeData;
          if (index !== -1) {
            target = data.treeData[index];
          } else {
            target = getItemProp({
              data,
              focusArea,
              dataset: 'treeNodeId',
              val: 'obj'
            });
          }
          return target && target.children && target.children.length > 0;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            const keyFieldName = 'key';
            const key: string = focusArea.dataset['treeNodeId'];
            const index = data.treeData.findIndex((item) => item[keyFieldName] === key);
            if (index !== -1) {
              data.treeData[index].children = [];
            } else {
              const target: TreeData = getItemProp({
                data,
                focusArea,
                dataset: 'treeNodeId',
                val: 'obj'
              });
              if (target && target.children) target.children = [];
            }
          }
        }
      }
    ]
  },
  '[data-action-btns]': actionBtnsEditor,
  '[data-btn-id]': ({ data, focusArea }: EditorResult<Data>, cate1, cate2, cate3) => {
    if (!focusArea) return;
    const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
    const cates = actionBtnEditor(btn, data);
    cate1.title = cates[0].title;
    cate1.items = cates[0].items;
    cate2.title = cates[1].title;
    cate2.items = cates[1].items;
    cate3.title = cates[2].title;
    cate3.items = cates[2].items;
  }
};

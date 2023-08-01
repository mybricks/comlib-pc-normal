import { uuid } from '../utils';
import { actionBtnsEditor, actionBtnEditor, addBtn } from './actionBtnEditor';
import { Data, TreeData, MODIFY_BTN_ID, DELETE_BTN_ID } from './constants';
import { pretreatTreeData, setCheckboxStatus, traverseTree } from './utils';

interface Result {
  data: Data;
  input: any;
  output: any;
  focusArea?: any;
}

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
  const item = traverseTree({
    treeData: data.treeData,
    targetKey: key,
    isParent
  });
  if (val === 'obj') return item;
  else return item[val];
};

const moveNode = ({ data, focusArea, isDown }: { data: Data; focusArea: any; isDown: boolean }) => {
  const key: string = focusArea.dataset['treeNodeId'];
  const index = data.treeData.findIndex((item) => item.key === key);
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
      const chileIndex = parent.children.findIndex((item) => item.key === key);
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
  '@init': ({ data }: Result) => {
    pretreatTreeData({ treeData: data.treeData, data, defaultExpandAll: true });
    setCheckboxStatus({ treeData: data.treeData, value: false });
  },
  ':root': {
    title: '树组件',
    style: [
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
          'div.ant-tree-treenode > span.ant-tree-node-content-wrapper > .ant-tree-title .title '
      }
    ],
    items: ({ data, output }: EditorResult<Data>, ...cate) => {
      cate[0].title = '常规';
      cate[1].title = '高级';
      cate[0].items = [
        {
          title: '配置',
          items: [
            {
              title: '节点标识字段',
              type: 'text',
              description:
                '不填时会根据节点位置生成唯一标识，存储在key属性中。所有节点的标识字段值在整个树范围内不能重复。',
              value: {
                get({ data }: EditorResult<Data>) {
                  if (!data.keyFieldName) {
                    data.keyFieldName = 'key';
                  }
                  return data.keyFieldName;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.keyFieldName = value;
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
              title: '勾选',
              type: 'Switch',
              value: {
                get({ data }: Result) {
                  return data.checkable;
                },
                set({ data }: Result, value: boolean) {
                  data.checkable = value;
                }
              }
            },
            {
              title: '父子节点勾选联动',
              type: 'Switch',
              description: '关闭后，可以单独勾选父节点，子节点不再被联动选择。',
              ifVisible({ data }: EditorResult<Data>) {
                return data.checkable;
              },
              value: {
                get({ data }: Result) {
                  return !data.checkStrictly;
                },
                set({ data }: Result, value: boolean) {
                  data.checkStrictly = !value;
                }
              }
            },
            {
              title: '禁用',
              type: 'Switch',
              ifVisible({ data }: Result) {
                return data.checkable;
              },
              value: {
                get({ data }: Result) {
                  return data.disableCheckbox;
                },
                set({ data }: Result, value: boolean) {
                  setCheckboxStatus({ treeData: data.treeData, value });
                  data.disableCheckbox = value;
                }
              }
            },
            {
              title: '输出父节点信息',
              type: 'Switch',
              ifVisible({ data }: Result) {
                return data.checkable && !data.checkStrictly;
              },
              value: {
                get({ data }: Result) {
                  return data.outParentKeys;
                },
                set({ data }: Result, value: boolean) {
                  data.outParentKeys = value;
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
                  outputId: 'click'
                };
              }
            },
            {
              title: '勾选事件',
              type: 'Switch',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.useCheckEvent;
                },
                set({ data, output }: EditorResult<Data>, val) {
                  if (val) {
                    output.add('check', '勾选事件', {
                      title: '勾选项数据',
                      type: 'array',
                      items: {
                        type: 'string'
                      }
                    });
                  } else {
                    output.remove('check');
                  }
                  data.useCheckEvent = val;
                }
              }
            },
            {
              title: '勾选事件',
              type: '_Event',
              ifVisible({ data }: EditorResult<Data>) {
                return data.useCheckEvent;
              },
              options: () => {
                return {
                  outputId: 'check'
                };
              }
            }
          ]
        }
      ];
      cate[1].items = [
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
        },
        {
          title: '操作项',
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
                    id: 'modify'
                  },
                  {
                    type: 'link',
                    title: '删除',
                    size: 'middle',
                    id: 'delete'
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
        {
          title: '操作列表',
          description: '选中拖拽各项左侧手柄，可改变按钮的相对位置',
          type: 'array',
          ifVisible({ data }: EditorResult<Data>) {
            return data.useActions;
          },
          options: {
            addText: '添加按钮',
            deletable: false,
            editable: false,
            getTitle: (item) => {
              return item?.title;
            },
            onAdd: () => {
              return addBtn({ data, output });
            }
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.actionBtns || [];
            },
            set({ data }: EditorResult<Data>, val: any[]) {
              data.actionBtns = val;
            }
          }
        },
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
          options: () => {
            return {
              outputId: 'addNodeDone'
            };
          }
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
          if (!focusArea) return;
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
          const index = data.treeData.findIndex((item) => item.key === key);
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
            if (parent && parent.children?.[0].key === key) return false;
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
          const index = data.treeData.findIndex((item) => item.key === key);
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
            if (parent && parent.children?.[parent.children.length - 1].key === key) return false;
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
            const index = data.treeData.findIndex((item) => item.key === key);
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
                const index = parent.children.findIndex((item) => item.key === key);
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
          const key: string = focusArea.dataset['treeNodeId'];
          const index = data.treeData.findIndex((item) => item.key === key);
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
            const key: string = focusArea.dataset['treeNodeId'];
            const index = data.treeData.findIndex((item) => item.key === key);
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
  '[data-btn-id]': actionBtnEditor
};

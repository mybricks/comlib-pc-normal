import { uuid } from '../utils';
import { actionBtnsEditor, actionBtnEditor, getBtnProp } from './actionBtnEditor';
import { commonActionBtnsEditor } from './actionBtnsCommonEditor';
import { Data, TreeData, MODIFY_BTN_ID, DELETE_BTN_ID, IconSrcType } from './constants';
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
      },
      {
        title: '树节点选中样式',
        options: [
          {
            type: 'font',
            config: {
              disableTextAlign: true
            }
          },
          'boreder',
          { type: 'background', config: { disableBackgroundImage: true } }
        ],
        target: 'div.ant-tree-treenode > span.ant-tree-node-content-wrapper.ant-tree-node-selected'
      },
      {
        title: '树节点勾选样式',
        options: [
          {
            type: 'font',
            config: {
              disableTextAlign: true
            }
          },
          'boreder',
          { type: 'background', config: { disableBackgroundImage: true } }
        ],
        target:
          'div.ant-tree-treenode.ant-tree-treenode-checkbox-checked > span.ant-tree-node-content-wrapper'
      },
      {
        title: '节点图标配置',
        items: [
          {
            title: '尺寸',
            type: 'InputNumber',
            options: [
              { title: '高度', min: 0, width: 100 },
              { title: '宽度', min: 0, width: 100 }
            ],
            value: {
              get({ data }: EditorResult<Data>) {
                return data.iconConfig?.size || [14, 14];
              },
              set({ data }: EditorResult<Data>, value: [number, number]) {
                data.iconConfig.size = value;
              }
            }
          },
          {
            title: '间距',
            type: 'Inputnumber',
            options: [{ min: 0, max: 1000, width: 200 }],
            description: '图标与文字间的距离',
            value: {
              get({ data }: EditorResult<Data>) {
                return [data.iconConfig.gutter || 8];
              },
              set({ data }: EditorResult<Data>, value: number[]) {
                data.iconConfig.gutter = value[0];
              }
            }
          },
          {
            title: '默认图标',
            type: 'Radio',
            options: [
              { label: '无', value: false },
              { label: '内置图标库', value: 'inner' },
              { label: '自定义上传', value: 'custom' }
            ],
            value: {
              get({ data }: EditorResult<Data>) {
                return data.iconConfig?.defaultSrc || false;
              },
              set({ data }: EditorResult<Data>, value: IconSrcType) {
                data.iconConfig.defaultSrc = value;
              }
            }
          },
          {
            title: '图标库',
            type: 'Icon',
            ifVisible({ data }: EditorResult<Data>) {
              return data.iconConfig?.defaultSrc === 'inner';
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.iconConfig?.innerIcon || 'FolderOpenOutlined';
              },
              set({ data }: EditorResult<Data>, value: string) {
                data.iconConfig.innerIcon = value;
              }
            }
          },
          {
            title: '上传',
            type: 'ImageSelector',
            ifVisible({ data }: EditorResult<Data>) {
              return data.iconConfig?.defaultSrc === 'custom';
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.iconConfig?.customIcon;
              },
              set({ data }: EditorResult<Data>, value: string) {
                data.iconConfig.customIcon = value;
              }
            }
          }
        ]
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
              ifVisible({ data }: EditorResult<Data>) {
                return data.checkable;
              },
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

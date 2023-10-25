import { uuid } from '../utils';
import { commonActionBtnsEditor } from './actionBtnsCommonEditor';
import { ActionBtn, Data, DELETE_BTN_ID, IconSrcType, MODIFY_BTN_ID } from './types';
import { getNodeSuggestions } from './utils';

function removeActionBtn({ data, focusArea, output }) {
  const btns: any[] = data.actionBtns;
  const btnId = focusArea.dataset['btnId'];
  const idx = btns.findIndex((item) => item.id === btnId);
  if (idx !== -1) {
    btns.splice(idx, 1);
    output.remove(btnId);
  }
}
function moveForwardActionBtn({ data, focusArea }) {
  const btns: any[] = data.actionBtns;
  const btnId = focusArea.dataset['btnId'];
  const idx = btns.findIndex((item) => item.id === btnId);
  const btn = btns[idx];
  if (idx !== -1) {
    btns.splice(idx, 1);
    btns.splice(idx - 1, 0, btn);
  }
}
function moveBackActionBtn({ data, focusArea }) {
  const btns: any[] = data.actionBtns;
  const btnId = focusArea.dataset['btnId'];
  const idx = btns.findIndex((item) => item.id === btnId);
  const btn = btns[idx];
  if (idx !== -1) {
    btns.splice(idx, 1);
    btns.splice(idx + 1, 0, btn);
  }
}
function allowMove({ data, focusArea }) {
  const res: string[] = [];
  const btns: any[] = data.actionBtns;
  const btnId = focusArea.dataset['btnId'];
  const idx = btns.findIndex((item) => item.id === btnId);
  if (idx === -1) {
    return res;
  }
  if (idx !== 0) {
    res.push('forward');
  }
  if (idx !== btns.length - 1) {
    res.push('back');
  }
  return res;
}

export const addBtn = ({ data, output }: { data: Data; output: any }) => {
  const id = uuid(),
    title = '按钮';
  const schema = {
    title: '节点数据',
    type: 'object',
    properties: {
      title: {
        title: '标题',
        type: 'string'
      },
      key: {
        title: '字段名',
        type: 'string'
      },
      disableCheckbox: {
        title: '禁用勾选',
        type: 'boolean'
      }
    }
  };
  const defaultBtn = {
    id,
    title,
    showText: true,
    size: 'middle',
    type: 'link',
    iconConfig: {
      src: false,
      size: [
        14,
        14
      ],
      gutter: 8
    }
  };
  output.add(id, title, schema);
  return defaultBtn;
};

export const getBtnProp = (data: Data, focusArea: any, dataset: any, val: any) => {
  if (!focusArea) return;
  const btnId: string = focusArea.dataset[dataset];
  const item = data.actionBtns.find((btn) => btn.id === btnId) || {};
  if (val === 'obj') return item;
  else return item[val];
};

export const actionBtnsEditor = {
  title: '操作项',
  items: ({ data, output }: EditorResult<Data>, cate1) => {
    cate1.title = '操作项';
    cate1.items = [
      {
        title: '隐藏修改操作',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            const btn = data.actionBtns.find((def) => def.id === MODIFY_BTN_ID);
            return btn?.hidden;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            const btn = data.actionBtns.find((def) => def.id === MODIFY_BTN_ID);
            btn && (btn.hidden = value);
          }
        }
      },
      {
        title: '隐藏删除操作',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            const btn = data.actionBtns.find((def) => def.id === DELETE_BTN_ID);
            return btn?.hidden;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            const btn = data.actionBtns.find((def) => def.id === DELETE_BTN_ID);
            btn && (btn.hidden = value);
          }
        }
      },
      {
        title: '支持非叶节点删除',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          const btn = data.actionBtns.find((def) => def.id === DELETE_BTN_ID);
          return !btn?.hidden;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.allNodeDeletable;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.allNodeDeletable = value;
          }
        }
      },
      commonActionBtnsEditor(data, output)
    ];
  }
};

export const actionBtnEditor = (btn: ActionBtn, data: Data) => [
  {
    title: '操作',
    items: [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ }: EditorResult<Data>) {
            return btn.title;
          },
          set({ }: EditorResult<Data>, value: string) {
            btn.title = value;
          }
        }
      },
      {
        title: '删除二次提示',
        type: 'expression',
        options: {
          suggestions: [
            {
              label: 'title',
              detail: '标题'
            },
            {
              label: 'key',
              detail: '键值'
            }
          ]
        },
        ifVisible({ }: EditorResult<Data>) {
          return btn.id === 'delete';
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.removeConfirm;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.removeConfirm = val;
          }
        }
      },
      {
        title: '行内编辑',
        type: 'switch',
        ifVisible({ }: EditorResult<Data>) {
          return btn.id === 'modify';
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.editInline;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.editInline = val;
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        ifVisible({ }: EditorResult<Data>) {
          return ![MODIFY_BTN_ID, DELETE_BTN_ID].includes(btn.id);
        },
        value: {
          set({ data, focusArea, output }: EditorResult<Data>) {
            if (!focusArea) return;
            removeActionBtn({ data, focusArea, output });
          }
        }
      },
      {
        title: '隐藏',
        type: 'Switch',
        ifVisible({ }: EditorResult<Data>) {
          return [MODIFY_BTN_ID, DELETE_BTN_ID].includes(btn.id);
        },
        value: {
          get({ }: EditorResult<Data>) {
            return btn.hidden;
          },
          set({ }: EditorResult<Data>, value: boolean) {
            btn.hidden = value;
          }
        }
      },
      {
        title: '前移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return allowMove({ data, focusArea }).includes('forward');
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            moveForwardActionBtn({ data, focusArea });
          }
        }
      },
      {
        title: '后移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return allowMove({ data, focusArea }).includes('back');
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            moveBackActionBtn({ data, focusArea });
          }
        }
      },
      {
        title: '事件',
        ifVisible({ }: EditorResult<Data>) {
          return !!btn.id;
        },
        items: [
          {
            title: '单击',
            type: '_Event',
            options: ({ data, focusArea }) => {
              const btn = getBtnProp(data, focusArea, 'btnId', 'id');
              return {
                outputId: btn
              };
            }
          }
        ]
      }
    ]
  },
  {
    title: '高级',
    items: [
      {
        title: '动态显示',
        description: `根据节点数据在调试态下动态显示该按钮的表达式，支持JS表达式语法, 例：{node.title === '1'}`,
        type: 'expression',
        options: {
          placeholder: `例：{node.isLeaf} 按钮在叶子节点中显示`,
          suggestions: getNodeSuggestions(data)
        },
        value: {
          get({ }: EditorResult<Data>) {
            return btn.displayScript;
          },
          set({ }: EditorResult<Data>, value: string) {
            btn.displayScript = value;
          }
        }
      },
    ]
  },
  {
    title: '样式',
    items: [
      {
        title: '风格',
        type: 'Select',
        options() {
          return [
            { value: 'primary', label: '主按钮' },
            { value: 'ghost', label: '次按钮' },
            { value: 'dashed', label: '虚线按钮' },
            { value: 'link', label: '链接按钮' },
            { value: 'text', label: '文字按钮' }
          ];
        },
        value: {
          get({ }: EditorResult<Data>) {
            return btn.type;
          },
          set({ }: EditorResult<Data>, value) {
            btn.type = value;
          }
        }
      },
      {
        title: '危险按钮',
        type: 'Switch',
        value: {
          get({ }: EditorResult<Data>) {
            return btn.danger || false;
          },
          set({ }: EditorResult<Data>, value) {
            btn.danger = value;
          }
        }
      
      },
      {
        title: '图标配置',
        items: [
          {
            title: '图标来源',
            type: 'Radio',
            options: [
              { label: '无', value: false },
              { label: '内置图标库', value: 'inner' },
              { label: '自定义上传', value: 'custom' }
            ],
            value: {
              get({ }: EditorResult<Data>) {
                return btn.iconConfig?.src || false;
              },
              set({ }: EditorResult<Data>, value: IconSrcType) {
                btn.iconConfig.src = value;
              }
            }
          },
          {
            title: '图标库',
            type: 'Icon',
            ifVisible({ }: EditorResult<Data>) {
              return btn.iconConfig?.src === 'inner';
            },
            value: {
              get({ }: EditorResult<Data>) {
                return btn.iconConfig?.innerIcon || 'EditOutlined';
              },
              set({ }: EditorResult<Data>, value: string) {
                btn.iconConfig.innerIcon = value;
              }
            }
          },
          {
            title: '上传',
            type: 'ImageSelector',
            ifVisible({ }: EditorResult<Data>) {
              return btn.iconConfig?.src === 'custom';
            },
            value: {
              get({ }: EditorResult<Data>) {
                return btn.iconConfig?.customIcon;
              },
              set({ }: EditorResult<Data>, value: string) {
                btn.iconConfig.customIcon = value;
              }
            }
          },
          {
            title: '尺寸',
            type: 'InputNumber',
            options: [
              { title: '高度', min: 0, width: 100 },
              { title: '宽度', min: 0, width: 100 }
            ],
            ifVisible({ }: EditorResult<Data>) {
              return !!btn.iconConfig?.src;
            },
            value: {
              get({ }: EditorResult<Data>) {
                return btn.iconConfig?.size || [14, 14];
              },
              set({ }: EditorResult<Data>, value: [number, number]) {
                btn.iconConfig.size = value;
              }
            }
          },
          {
            title: '间距',
            type: 'Inputnumber',
            options: [{ min: 0, max: 1000, width: 200 }],
            description: '图标与文字间的距离',
            ifVisible({ }: EditorResult<Data>) {
              return !!btn.iconConfig?.src;
            },
            value: {
              get({ }: EditorResult<Data>) {
                return [btn.iconConfig?.gutter || 8];
              },
              set({ }: EditorResult<Data>, value: number[]) {
                btn.iconConfig.gutter = value[0];
              }
            }
          },
        ]
      },
    ]
  },
];

export const styleEditor = [
  {
    title: '风格',
    type: 'Select',
    options() {
      return [
        { value: 'primary', label: '主按钮' },
        { value: 'ghost', label: '次按钮' },
        { value: 'dashed', label: '虚线按钮' },
        { value: 'link', label: '链接按钮' },
        { value: 'text', label: '文字按钮' }
      ];
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
        return btn.type;
      },
      set({ data, focusArea }: EditorResult<Data>, value) {
        const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
        btn.type = value;
      }
    }
  },
  {
    title: '危险按钮',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
        return btn.danger || false;
      },
      set({ data, focusArea }: EditorResult<Data>, value) {
        const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
        btn.danger = value;
      }
    }
  },
  {
    title: '图标配置',
    items: [
      {
        title: '图标来源',
        type: 'Radio',
        options: [
          { label: '无', value: false },
          { label: '内置图标库', value: 'inner' },
          { label: '自定义上传', value: 'custom' }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            return btn.iconConfig?.src || false;
          },
          set({ data, focusArea }: EditorResult<Data>, value: IconSrcType) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            btn.iconConfig.src = value;
          }
        }
      },
      {
        title: '图标库',
        type: 'Icon',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
          return btn.iconConfig?.src === 'inner';
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            return btn.iconConfig?.innerIcon || 'EditOutlined';
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            btn.iconConfig.innerIcon = value;
          }
        }
      },
      {
        title: '上传',
        type: 'ImageSelector',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
          return btn.iconConfig?.src === 'custom';
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            return btn.iconConfig?.customIcon;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            btn.iconConfig.customIcon = value;
          }
        }
      },
      {
        title: '尺寸',
        type: 'InputNumber',
        options: [
          { title: '高度', min: 0, width: 100 },
          { title: '宽度', min: 0, width: 100 }
        ],
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
          return !!btn.iconConfig?.src;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            return btn.iconConfig?.size || [14, 14];
          },
          set({ data, focusArea }: EditorResult<Data>, value: [number, number]) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            btn.iconConfig.size = value;
          }
        }
      },
      {
        title: '间距',
        type: 'Inputnumber',
        options: [{ min: 0, max: 1000, width: 200 }],
        description: '图标与文字间的距离',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
          return !!btn.iconConfig?.src;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            return [btn.iconConfig?.gutter || 8];
          },
          set({ data, focusArea }: EditorResult<Data>, value: number[]) {
            const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
            btn.iconConfig.gutter = value[0];
          }
        }
      },
    ]
  }
]
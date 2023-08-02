import { uuid } from "../utils";
import { commonActionBtnsEditor } from "./actionBtnsCommonEditor";
import { Data, DELETE_BTN_ID, MODIFY_BTN_ID } from "./constants";

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

export const addBtn = ({ data, output }: { data: Data, output: any }) => {
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
    type: 'ghost',
  };
  output.add(id, title, schema);
  return defaultBtn;
};

const getBtnProp = (
  data: Data,
  focusArea: any,
  dataset: any,
  val: any
) => {
  if (!focusArea) return;
  const btnId: string = focusArea.dataset[dataset];
  const item = data.actionBtns.find(btn => btn.id === btnId) || {};
  if (val === "obj") return item;
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
            const btn = data.actionBtns.find(def => def.id === MODIFY_BTN_ID);
            return btn?.hidden;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            const btn = data.actionBtns.find(def => def.id === MODIFY_BTN_ID);
            btn && (btn.hidden = value);
          }
        }
      },
      {
        title: '隐藏删除操作',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            const btn = data.actionBtns.find(def => def.id === DELETE_BTN_ID);
            return btn?.hidden;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            const btn = data.actionBtns.find(def => def.id === DELETE_BTN_ID);
            btn && (btn.hidden = value);
          }
        }
      },
      {
        title: '支持非叶节点删除',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          const btn = data.actionBtns.find(def => def.id === DELETE_BTN_ID);
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

export const actionBtnEditor = {
  title: '操作',
  items: [
    {
      title: '名称',
      type: 'Text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return getBtnProp(data, focusArea, 'btnId', 'title');
        },
        set({ data, focusArea }: EditorResult<Data>, value: string) {
          if (typeof value !== 'string' || value.trim() === '') {
            throw new Error(`请输入正确的按钮标题.`);
          }
          const res = getBtnProp(data, focusArea, 'btnId', 'obj');
          res.title = value;
        }
      }
    },
    {
      title: '按钮类型',
      type: 'Select',
      options() {
        return [
          { value: 'primary', label: '主按钮' },
          { value: 'ghost', label: '次按钮' },
          { value: 'dashed', label: '虚线按钮' },
          { value: 'danger', label: '危险按钮' },
          { value: 'link', label: '链接按钮' },
          { value: 'text', label: '文字按钮' }
        ];
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return getBtnProp(data, focusArea, 'btnId', 'type');
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          if (!focusArea) return;
          const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
          btn.type = value;
        }
      }
    },
    {
      title: '删除',
      type: 'Button',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
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
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
        return [MODIFY_BTN_ID, DELETE_BTN_ID].includes(btn.id);
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          return getBtnProp(data, focusArea, 'btnId', 'hidden');
        },
        set({ data, focusArea, output }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          const btn = getBtnProp(data, focusArea, 'btnId', 'obj');
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
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return !!getBtnProp(data, focusArea, 'btnId', 'id');
      },
      items: [
        {
          title: '单击',
          type: '_Event',
          options: ({ data, focusArea }) => {
            const res = getBtnProp(data, focusArea, 'btnId', 'id');
            return {
              outputId: res
            };
          }
        }
      ]
    },
  ]
}
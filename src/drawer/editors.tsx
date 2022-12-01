import { Data, Location, InputIds, SlotIds } from './constants';
import { uuid } from '../utils';

const defaultSchema = { type: 'any' };

// 添加按钮事件
function addBtnOutputs({ btn, output, slot }: { btn: any; output: any; slot: any }) {
  const { id: btnId, title } = btn;
  const followSchema = {
    type: 'follow'
  };
  output.add(btnId, title, defaultSchema);
  output.add(`${btnId}Click`, `点击${title}`, defaultSchema);
  slot.get(SlotIds.Content)?.outputs.add(btnId, title, followSchema);
}
// 删除按钮事件
function removeBtnOutputs({ btn, output, slot }: { btn: any; output: any; slot: any }) {
  const { id: btnId } = btn;
  output.remove(btnId);
  output.remove(`${btnId}Click`);
  slot.get(SlotIds.Content)?.outputs.remove(btnId);
}

export default {
  '@inputUpdated'({ data, input, output, slots }, pin) {
    //id pin's id
    // console.log('inputUpdated', pin)
    if (pin.id === InputIds.Open) {
      slots.get(SlotIds.Content)?.inputs.get(SlotIds.DataSource)?.setSchema(pin.schema);
    }
  },
  '@slotInputUpdated'({ data, slots, output }, pin) {
    // console.log('slotInputUpdated', pin)
    output.get(pin.id)?.setSchema(pin.schema);
  },
  '@slotInputConnected'({ data, slots, input, output }, fromPin, slotId, toPin) {
    // console.log('slotInputConnected', fromPin, toPin)
    const btnId = toPin.id,
      btn = data.footerBtns.find((btn) => btn.id === btnId);
    btn.isConnected = true;
    const newRels = data.footerBtns.filter(({ isConnected }) => isConnected).map(({ id }) => id);
    input.get(InputIds.Open).setRels(newRels);
    output.get(toPin.id)?.setSchema(fromPin.schema);
  },
  '@slotInputDisConnected'({ data, slots, input, output }, fromPin, slotId, toPin) {
    // console.log('slotInputDisConnected', toPin)
    const btnId = toPin.id,
      btn = data.footerBtns.find((btn) => btn.id === btnId);
    btn.isConnected = false;
    const newRels = data.footerBtns.filter(({ isConnected }) => isConnected).map(({ id }) => id);
    input.get(InputIds.Open).setRels(newRels);
    output.get(toPin.id)?.setSchema(defaultSchema);
  },
  '@inputDisConnected'({ data, input, output, slots }, fromPin, toPin) {
    // console.log('inputDisConnected')
    if (toPin.id === InputIds.Open) {
      slots.get(SlotIds.Content)?.inputs.get(SlotIds.DataSource)?.setSchema(defaultSchema);
    }
  },
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '标题',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.title;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.title = value;
          }
        }
      },
      {
        title: '关闭按钮',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            if (data.closable === undefined) {
              data.closable = true;
            }
            return data.closable;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.closable = value;
          }
        }
      },
      {
        title: '遮罩配置',
        items: [
          {
            title: '遮罩',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.showMask;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.showMask = value;
              }
            }
          },
          {
            title: '点击蒙层后关闭	',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.maskClosable !== false;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.maskClosable = value;
              }
            }
          }
        ]
      },
      {
        title: '页脚配置',
        items: [
          {
            title: '页脚',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.useFooter;
              },
              set({ data, input, output, slot }: EditorResult<Data>, value: boolean) {
                data.useFooter = value;
                if (value) {
                  data.footerBtns.forEach((btn) => {
                    addBtnOutputs({
                      output,
                      slot,
                      btn
                    });
                  });
                } else {
                  data.footerBtns.forEach((btn) => {
                    removeBtnOutputs({
                      output,
                      slot,
                      btn
                    });
                  });
                }
              }
            }
          },
          {
            title: '布局',
            type: 'Select',
            options: [
              { value: 'center', label: '居中' },
              { value: 'flex-start', label: '居左' },
              { value: 'flex-end', label: '居右' }
            ],
            ifVisible({ data }: EditorResult<Data>) {
              return data.useFooter;
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.footerAlign;
              },
              set({ data }: EditorResult<Data>, value: string) {
                data.footerAlign = value;
              }
            }
          }
        ]
      },
      {
        title: '高级',
        items: [
          {
            title: '关闭时销毁',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.destroyOnClose;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.destroyOnClose = value;
              }
            }
          }
        ]
      }
    ];

    cate2.title = '样式';
    cate2.items = [
      {
        title: '内容背景色',
        type: 'colorpicker',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.bodyStyle?.backgroundColor;
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (!data.bodyStyle) {
              data.bodyStyle = {};
            }
            data.bodyStyle.backgroundColor = value;
          }
        }
      },
      {
        title: '抽屉位置',
        type: 'Select',
        description: '抽屉在屏幕展开的位置',
        options() {
          return [
            { label: '上', value: 'top' },
            { label: '下', value: 'bottom' },
            { label: '左', value: 'left' },
            { label: '右', value: 'right' }
          ];
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.position;
          },
          set(
            { data }: EditorResult<Data>,
            value: 'top' | 'right' | 'bottom' | 'left' | undefined
          ) {
            data.position = value;
          }
        }
      },
      {
        title: '抽屉宽高',
        type: 'Style',
        options: {
          plugins: ['Size']
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return {
              height: data.height,
              width: data.width
            };
          },
          set({ data }: EditorResult<Data>, value: any) {
            data.height = value?.height;
            data.width = value?.width;
          }
        }
      }
    ];

    return {
      title: '抽屉'
    };
  },
  '[data-btn-id]': ({}: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '按钮';
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, 'btnId', 'title');
          },
          set({ data, focusArea, output, input, slots }: EditorResult<Data>, value: string) {
            if (typeof value !== 'string' || value.trim() === '') {
              throw new Error(`请输入正确的按钮标题.`);
            }
            const res = get(data, focusArea, 'btnId', 'obj');
            slots.get(SlotIds.Content).outputs.get(res.id).setTitle(`${value}`);
            output.setTitle(res.id, value);
            output.setTitle(`${res.id}Click`, `点击${value}`);
            if (res.dynamicDisabled) {
              input.setTitle(`disable${res.id}`, `禁用-${value}按钮`);
              input.setTitle(`enable${res.id}`, `启用-${value}按钮`);
            }
            if (res.dynamicHidden) {
              input.setTitle(`hidden${res.id}`, `隐藏-${value}按钮`);
              input.setTitle(`show${res.id}`, `显示-${value}按钮`);
            }
            res.title = value;
          }
        }
      },
      {
        title: '基础样式',
        items: [
          {
            title: '风格',
            type: 'Select',
            options() {
              return [
                { value: 'default', label: '默认' },
                { value: 'primary', label: '主按钮' },
                { value: 'dashed', label: '虚线按钮' },
                { value: 'danger', label: '危险按钮' },
                { value: 'link', label: '链接按钮' },
                { value: 'text', label: '文字按钮' }
              ];
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                return get(data, focusArea, 'btnId', 'type');
              },
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                const res = get(data, focusArea, 'btnId', 'obj');
                res.type = value;
              }
            }
          }
        ]
      },
      icon('btnId'),
      {
        title: '事件',
        items: [
          {
            title: '单击',
            type: '_Event',

            options: ({ data, focusArea }: EditorResult<Data>) => {
              const res = get(data, focusArea, 'btnId', 'id');
              return {
                outputId: `${res}Click`,
                slotId: SlotIds.Content
              };
            }
          }
        ]
      },
      moveDelete('btnId')
    ];
    return { title: '按钮' };
  },
  '.ant-drawer-title': {
    title: '标题',
    items: [
      {
        title: '内容',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.title;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.title = value;
          }
        }
      }
    ]
  },
  '.ant-drawer-close': {
    title: '关闭按钮',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            if (data.closable === undefined) {
              data.closable = true;
            }
            return data.closable;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.closable = value;
          }
        }
      }
    ]
  }
};

function get(data: Data, focusArea: any, dataset: string, val = 'obj', cb?: any) {
  if (!focusArea) return;
  const key = focusArea.dataset[dataset];
  const index = data.footerBtns.findIndex((def) => def.id === key);
  if (index === -1) return;
  if (cb) cb(index);
  if (val === 'obj') {
    return data.footerBtns[index];
  }
  return data.footerBtns[index][val];
}

function addBtn({ data, input, output, slot }: EditorResult<Data>) {
  const { footerBtns } = data;
  const id = uuid();
  const title = `按钮${footerBtns.length + 1}`;

  const defaultBtn: any = {
    id,
    title,
    icon: '',
    useIcon: false,
    showText: true,
    type: 'default',
    outputDs: false,
    isConnected: false
  };

  data.footerBtns.unshift(defaultBtn);
  addBtnOutputs({
    output,
    slot,
    btn: defaultBtn
  });
}

function icon(dataset: string) {
  return {
    title: '图标',
    items: [
      {
        title: '显示文字',
        type: 'Switch',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const res = get(data, focusArea, dataset, 'obj');
          return res?.useIcon && res?.icon?.length ? true : false;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, dataset, 'showText');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            const res = get(data, focusArea, dataset, 'obj');
            res.showText = value;
          }
        }
      },
      {
        title: '使用图标',
        type: 'Switch',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return get(data, focusArea, dataset, 'showText');
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, dataset, 'useIcon');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            const res = get(data, focusArea, dataset, 'obj');
            if (!res?.icon?.length) {
              res.icon = 'HomeOutlined';
            }
            res.useIcon = value;
          }
        }
      },
      {
        title: '图标位置',
        type: 'Select',
        options: [
          { label: '位于文字前', value: Location.FRONT },
          { label: '位于文字后', value: Location.BACK }
        ],
        ifVisible({ data, focusArea }) {
          const res = get(data, focusArea, dataset, 'obj');
          return res?.useIcon && res?.icon?.length && res.showText;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, dataset, 'location') || Location.FRONT;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            const res = get(data, focusArea, dataset, 'obj');
            res.location = value;
          }
        }
      },
      {
        type: 'Icon',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return get(data, focusArea, dataset, 'useIcon');
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, dataset, 'icon');
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const res = get(data, focusArea, dataset, 'obj');
            res.icon = value;
          }
        }
      }
    ]
  };
}

function moveDelete(dataset: string) {
  return {
    title: '位置',
    items: [
      {
        title: '新增操作',
        type: 'Button',
        value: {
          set(params: EditorResult<Data>) {
            addBtn(params);
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        ifVisible({ data }: EditorResult<Data>) {
          return data.footerBtns.length > 1;
        },
        value: {
          set({ data, focusArea, input, output, slot }: EditorResult<Data>) {
            get(data, focusArea, dataset, 'obj', (index: number) => {
              const btn = data.footerBtns[index];
              data.footerBtns.splice(index, 1);
              if (btn.isConnected) {
                input
                  .get(InputIds.Open)
                  .setRels(data.footerBtns.filter((btn) => btn.isConnected).map((btn) => btn.id));
              }
              removeBtnOutputs({ btn, slot, output });
            });
          }
        }
      },
      {
        title: '前移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          let bool = false;
          get(data, focusArea, dataset, 'obj', (index) => {
            if (data.footerBtns.length > 1 && index !== 0) {
              bool = true;
            }
          });
          return bool;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            get(data, focusArea, dataset, 'obj', (index) => {
              const tool = data.footerBtns[index];
              data.footerBtns.splice(index, 1);
              data.footerBtns.splice(index - 1, 0, tool);
            });
          }
        }
      },
      {
        title: '后移',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          let bool = false;
          get(data, focusArea, dataset, 'obj', (index) => {
            if (data.footerBtns.length > 1 && index !== data.footerBtns.length - 1) {
              bool = true;
            }
          });
          return bool;
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            get(data, focusArea, dataset, 'obj', (index) => {
              const tool = data.footerBtns[index];
              data.footerBtns.splice(index, 1);
              data.footerBtns.splice(index + 1, 0, tool);
            });
          }
        }
      }
    ]
  };
}

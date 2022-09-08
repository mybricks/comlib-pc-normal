import { isEmptyString, uuid } from '../utils';
import { FOOTER_CONTENT_TYPE, Data, Location, SlotIds, InputIds, SlotInputIds, DefaultEvent } from './constants';

const defaultSchema = { type: 'any' };

const updateOpenRels = (data: Data): any[] => {
  return data.footerBtns.filter(({ id, visible }) => {
    if (DefaultEvent.includes(id)) {
      return visible;
    }
    return true;
  }).map(({ id }) => id);
};

function addBtn({ data, input, output, slot }: { data: Data, input: any, output: any, slot: any }, defaultId?: string) {
  const { footerBtns } = data;
  const titleMap = {
    [DefaultEvent[0]]: '确认',
    [DefaultEvent[1]]: '取消',
  }
  const id = defaultId || uuid(),
    title = defaultId ? titleMap[defaultId] : `按钮${footerBtns.length + 1}`;
  const schema = {
    type: 'any'
  };

  const defaultBtn: any = {
    id,
    title,
    icon: '',
    useIcon: false,
    showText: true,
    type: 'default'
  };

  output.add(id, title, schema);
  // slot.get(SlotIds.Container).inputs.add(id, `${title}`, { type: 'any' });
  slot.get(SlotIds.Container).outputs.add(id, `${title}输出数据`, { type: 'follow' });
  input.get(InputIds.Open).setRels([...updateOpenRels(data), id]);

  if (!DefaultEvent.includes(id)) {
    data.footerBtns.unshift(defaultBtn);
  }
}

function removeBtn({ data, focusArea, input, output, slot }: { data: Data, focusArea: any, input: any, output: any, slot: any },) {
  get(data, focusArea, 'btnId', 'obj', (index: number) => {
    const btnId = data.footerBtns[index].id;

    output.remove(btnId);
    slot.get(SlotIds.Container).inputs.remove(btnId);
    slot.get(SlotIds.Container).outputs.remove(btnId);
    input.get(InputIds.Open).setRels(updateOpenRels(data));

    if (!DefaultEvent.includes(btnId)) {
      data.footerBtns.splice(index, 1);
    }
  });
}

function get(
  data: Data,
  focusArea: any,
  dataset: string,
  val = 'obj',
  cb?: any
) {
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

export default {
  '@inputUpdated'({ data, input, output, slots }, pin) {//id pin's id
    if (pin.id === InputIds.Open) {
      // input.get(InputIds.Open).setSchema(pin.schema);
      slots.get(SlotIds.Container).inputs.get(SlotInputIds.DataSource).setSchema(pin.schema);
    }
  },
  '@inputConnected'({ data, input, output, slots, ...slot }, fromPin, toPin) {
    if (toPin.id === InputIds.Open) {
      // input.get(InputIds.Open).setSchema(fromPin.schema);
      slots.get(SlotIds.Container).inputs.get(SlotInputIds.DataSource).setSchema(fromPin.schema);
    }
  },
  '@inputDisConnected'({ data, input, output, slots }, fromPin, toPin) {
    if (toPin.id === InputIds.Open) {
      // input.get(InputIds.Open).setSchema(defaultSchema);
      slots.get(SlotIds.Container).inputs.get(SlotInputIds.DataSource).setSchema(defaultSchema);
    }
  },
  ':root': ({ }: EditorResult<Data>, cate1, cate2, cate3) => {
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
            if (isEmptyString(value)) {
              data.title = value;
            }
          }
        }
      },
      {
        title: '隐藏标题',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.hideTitle;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.hideTitle = value;
          }
        }
      },
      {
        title: '关闭按钮',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.closable;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.closable = value;
          }
        }
      },
      {
        title: '垂直居中',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.centered;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.centered = value;
          }
        }
      },
      {
        title: '底部内容',
        items: [
          {
            title: '显示',
            type: 'switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.useFooter;
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.useFooter = value;
              }
            }
          },
          {
            title: '隐藏确认按钮',
            type: 'Switch',
            ifVisible({ data }: EditorResult<Data>) {
              return data.useFooter;
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return !data.footerBtns.find(({ id }) => id === DefaultEvent[0])?.visible;
              },
              set({ data, focusArea, input, output, slot }: EditorResult<Data>, value: boolean) {
                const res = data.footerBtns.find(({ id }) => id === DefaultEvent[0]);
                res && (res.visible = !value);
                if (value) {
                  removeBtn({ data, focusArea, input, output, slot })
                } else {
                  addBtn({ data, input, output, slot }, DefaultEvent[0]);
                }
              }
            }
          },
          {
            title: '隐藏取消按钮',
            type: 'Switch',
            ifVisible({ data }: EditorResult<Data>) {
              return data.useFooter;
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return !data.footerBtns.find(({ id }) => id === DefaultEvent[1])?.visible;
              },
              set({ data, focusArea, input, output, slot }: EditorResult<Data>, value: boolean) {
                const res = data.footerBtns.find(({ id }) => id === DefaultEvent[1]);
                res && (res.visible = !value);
                if (value) {
                  removeBtn({ data, focusArea, input, output, slot })
                } else {
                  addBtn({ data, input, output, slot }, DefaultEvent[1]);
                }
              }
            }
          },
          {
            title: '新增操作',
            ifVisible({ data }: EditorResult<Data>) {
              return (
                !!data.footerBtns &&
                data.useFooter
              );
            },
            type: 'Button',
            value: {
              set({ data, input, output, slot }: EditorResult<Data>) {
                addBtn({ data, input, output, slot });
              }
            }
          }
        ]
      }
    ];

    cate2.title = '样式';
    cate2.items = [
      {
        title: '弹窗宽度',
        description: '设置0将使用默认宽度：520',
        type: 'Slider',
        options: {
          max: 5000,
          min: 0,
          step: 100,
          formatter: 'px'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.width;
          },
          set({ data }: EditorResult<Data>, value: number) {
            data.width = value || undefined;
          }
        }
      },
      {
        title: '内容高度限制',
        description: '设置0为不限制，超出高度限制出现滚动条',
        type: 'Slider',
        options: {
          max: 5000,
          min: 0,
          step: 100,
          formatter: 'px'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.bodyStyle?.maxHeight;
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (!data.bodyStyle) {
              data.bodyStyle = {};
            }
            data.bodyStyle = {
              ...data.bodyStyle,
              maxHeight: value || undefined
            };
          }
        }
      },
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
            data.bodyStyle = {
              ...data.bodyStyle,
              backgroundColor: value
            };
          }
        }
      }
    ];

    cate3.title = '事件';

    return { title: '对话框' };
  },
  '[data-btn-id]': ({ }: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, 'btnId', 'title');
          },
          set(
            { data, focusArea, output, input, slot }: EditorResult<Data>,
            value: string
          ) {
            if (typeof value !== 'string' || value.trim() === '') {
              throw new Error(`请输入正确的按钮标题.`);
            }
            const res = get(data, focusArea, 'btnId', 'obj');
            output.setTitle(res.id, value);
            if (res.dynamicDisabled) {
              input.setTitle(`disable${res.id}`, `禁用-${value}按钮`);
              input.setTitle(`enable${res.id}`, `启用-${value}按钮`);
            }
            if (res.dynamicHidden) {
              input.setTitle(`hidden${res.id}`, `隐藏-${value}按钮`);
              input.setTitle(`show${res.id}`, `显示-${value}按钮`);
            }
            slot.get(SlotIds.Container).inputs.setTitle(res.id, `${value}`);
            slot.get(SlotIds.Container).outputs.setTitle(res.id, `${value}输出数据`);
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
        title: '隐藏',
        type: 'Switch',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const res = get(data, focusArea, 'btnId', 'obj');
          return DefaultEvent.includes(res?.id);
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return !get(data, focusArea, 'btnId', 'visible');
          },
          set({ data, focusArea, input, output, slot }: EditorResult<Data>, value: boolean) {
            const res = get(data, focusArea, 'btnId', 'obj');
            res.visible = !value;
            if (value) {
              removeBtn({ data, focusArea, input, output, slot })
            } else {
              addBtn({ data, input, output, slot }, res.id);
            }
          }
        }
      },
      moveDelete('btnId')
    ];

    cate2.title = '事件';
    cate2.items = [
      {
        title: '事件',
        items: [
          {
            title: '单击',
            type: '_Event',

            options: ({ data, focusArea }: EditorResult<Data>) => {
              const res = get(data, focusArea, 'btnId', 'id');
              return {
                outputId: res,
                slotId: SlotIds.Container
              };
            }
          }
        ]
      }
    ];

    return { title: '按钮' };
  }
};


function icon(dataset: string) {
  return {
    title: '图标',
    items: [
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
          set({ data, input, output, slot }: EditorResult<Data>) {
            addBtn({ data, input, output, slot });
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const { id } = get(data, focusArea, dataset, 'obj');
          return !DefaultEvent.includes(id);
        },
        value: {
          set({ data, focusArea, input, output, slot }: EditorResult<Data>) {
            removeBtn({ data, focusArea, input, output, slot });
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
            if (
              data.footerBtns.length > 1 &&
              index !== data.footerBtns.length - 1
            ) {
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

function useDynamic(dataset: string) {
  return {
    title: '动态配置',
    items: [
      {
        title: '禁用',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, dataset, 'dynamicDisabled');
          },
          set({ data, input, focusArea }: EditorResult<Data>, value: boolean) {
            const res = get(data, focusArea, dataset, 'obj');
            const schema = {
              type: 'any'
            };
            if (value) {
              input.add(`disable${res.id}`, `禁用-${res.title}按钮`, schema);
              input.add(`enable${res.id}`, `启用-${res.title}按钮`, schema);
            } else {
              input.remove(`disable${res.id}`);
              input.remove(`enable${res.id}`);
            }
            res.dynamicDisabled = value;
          }
        }
      },
      {
        title: '隐藏',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, dataset, 'dynamicHidden');
          },
          set({ data, input, focusArea }: EditorResult<Data>, value: boolean) {
            const res = get(data, focusArea, dataset, 'obj');
            const schema = {
              type: 'any'
            };
            if (value) {
              input.add(`hidden${res.id}`, `隐藏-${res.title}按钮`, schema);
              input.add(`show${res.id}`, `显示-${res.title}按钮`, schema);
            } else {
              input.remove(`hidden${res.id}`);
              input.remove(`show${res.id}`);
            }
            res.dynamicHidden = value;
          }
        }
      }
    ]
  };
}

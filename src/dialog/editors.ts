import { isEmptyString, uuid } from '../utils';
import { FOOTER_CONTENT_TYPE, Data, DialogButtonProps, Location, SlotIds, InputIds, SlotInputIds, DefaultEvent, AlignEnum, OutputIds } from './constants';

const defaultSchema = { type: 'any' };

/**
 * 计算最新的relOuputs
 * @param data 
 * @returns 最新的relOuputs
 */
const updateOpenRels = (data: Data): any[] => {
  return data.footerBtns.filter(({ id, isConnected, visible }) => {
    if (DefaultEvent.includes(id)) {
      return visible && isConnected;
    }
    return isConnected;
  }).map(({ id }) => id);
};

/**
 * 新增/显示按钮
 * @param env 上下文 
 * @param defaultId 确认/取消按钮的默认ID
 */
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

  const defaultBtn: DialogButtonProps = {
    id,
    title,
    icon: '',
    dynamicHidden: true,
    dynamicDisabled: true,
    visible: true,
    autoClose: true,
    useIcon: false,
    showText: true,
    type: 'default',
    isConnected: false
  };
  input.add(`hidden${id}`, `隐藏-${title}按钮`, schema);
  input.add(`show${id}`, `显示-${title}按钮`, schema);
  input.add(`disable${id}`, `禁用-${title}按钮`, schema);
  input.add(`enable${id}`, `启用-${title}按钮`, schema);
  output.add(id, title, schema);
  output.add(`${id}Click`, `点击${title}`, schema);
  // slot.get(SlotIds.Container).inputs.add(id, `${title}`, { type: 'any' });
  slot.get(SlotIds.Container).outputs.add(id, `${title}`, { type: 'follow' });

  if (!DefaultEvent.includes(id)) {
    data.footerBtns.unshift(defaultBtn);
  }
}

/**
 * 删除/隐藏按钮
 * @param env 上下文 
 * @param btnId 确认/取消按钮的默认ID
 */
function removeBtn({ data, input, output, slot }:
  { data: Data, input: any, output: any, slot: any },
  btnId: string
) {
  const index = data.footerBtns?.findIndex(btn => btn.id === btnId);
  output.remove(btnId);
  output.remove(`${btnId}Click`);
  slot.get(SlotIds.Container)?.outputs.remove(btnId);
  input.get(InputIds.Open)?.setRels(updateOpenRels(data));

  if (!DefaultEvent.includes(btnId)) {
    data.footerBtns.splice(index, 1);
  }
}

/**
 * GET方法
 * @param data 
 * @param focusArea 
 * @param dataset 
 * @param val 
 * @param cb 删除回调
 * @returns 
 */
function get(
  data: Data,
  focusArea: any,
  dataset: string,
  val: keyof DialogButtonProps | 'obj',
  cb?: any
) {
  if (!focusArea) return;
  const key = focusArea.dataset[dataset];
  const index = data.footerBtns.findIndex((def) => def.id === key);
  if (index === -1) return;
  if (cb) cb(index);
  if (val === 'obj') {
    return data.footerBtns[index] || {};
  }
  return data.footerBtns[index][val];
}

export default {
  '@inputUpdated'({ data, input, output, slots }, pin) {//id pin's id
    if (!data.isNew && pin.id === InputIds.Open) {
      // console.log('inputUpdated', pin)
      slots.get(SlotIds.Container)?.inputs.get(SlotInputIds.DataSource)?.setSchema(pin.schema);
    }
  },
  // '@outputUpdated'({ data, input, output, slots }, pin) {//id pin's id
  //   console.log('outputUpdated', pin)
  // },
  '@slotInputUpdated'({ data, slots, output }, slotId, pin) {
    // console.log('slotInputUpdated', slotId, pin)
    output.get(pin.id)?.setSchema(pin.schema);
  },
  '@slotOutputUpdated'({ data, input, slots, output }, slotId, pin) {
    // console.log('slotOutputUpdated', slotId, pin)
    if (data.isNew
      && slotId === SlotIds.Container
      && pin.id === SlotInputIds.DataSource) {
      input.get(InputIds.Open)?.setSchema(pin.schema);
    }
  },
  '@slotInputConnected'({ data, slots, input, output }, fromPin, slotId, toPin) {
    // console.log('slotInputConnected', fromPin, toPin)
    const btnId = toPin.id,
      btn = data.footerBtns.find(btn => btn.id === btnId);
    btn.isConnected = true;
    const newRels = [...updateOpenRels(data)];
    input.get(InputIds.Open).setRels(newRels);
    output.get(toPin.id)?.setSchema(fromPin.schema);
  },
  '@slotOuputConnected'({ data, slots, input, output }, fromPin, slotId, toPin) {
    // console.log('slotOuputConnected', fromPin, toPin)
  },
  '@slotOuputDisConnected'({ data, slots, input, output }, fromPin, slotId, toPin) {
    // console.log('slotOuputDisConnected', fromPin, slotId, toPin)
    if (data.isNew
      && slotId === SlotIds.Container
      && fromPin.id === SlotInputIds.DataSource) {
      input.get(InputIds.Open)?.setSchema({ type: 'any' });
    }
  },
  '@slotInputDisConnected'({ data, slots, input, output }, fromPin, slotId, toPin) {
    // console.log('slotInputDisConnected', toPin)
    const btnId = toPin.id,
      btn = data.footerBtns.find(btn => btn.id === btnId);
    btn.isConnected = false;
    const newRels = [...updateOpenRels(data)];
    input.get(InputIds.Open).setRels(newRels);
    output.get(toPin.id)?.setSchema(defaultSchema);
  },
  '@inputDisConnected'({ data, input, output, slots }, fromPin, toPin) {
    // console.log('inputDisConnected')
    if (!data.isNew && toPin.id === InputIds.Open) {
      slots.get(SlotIds.Container)?.inputs.get(SlotInputIds.DataSource)?.setSchema(defaultSchema);
    }
  },
  // '@outputConnected'({ data, output }, fromPin, toPin) {
  //   console.log('outputConnected', 'toPin', fromPin, toPin);
  // },
  '@inputConnected'({ data, input, output, slots }, fromPin, toPin) {
    // console.log('inputConnected', fromPin, toPin)
    if (!data.isNew && toPin.id === InputIds.Open) {
      slots.get(SlotIds.Container)?.inputs.get(SlotInputIds.DataSource)?.setSchema(defaultSchema);
    }
  },
  // '@connectorUpdated'({ data, input, output, slots }, fromPin, toPin) {
  //   console.log('connectorUpdated')
  // },
  // '@outputConnected'({ data, input, output, slots }, fromPin, toPin) {
  //   console.log('outputConnected')
  // },
  // '@outputDisConnected'({ data, input, output, slots }, fromPin, toPin) {
  //   console.log('outputDisConnected')
  // },
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
        },
      },
      {
        title: '点击蒙层关闭',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.maskClosable;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.maskClosable = val;
          }
        }
      },
      // {
      //   title: '关闭时销毁',
      //   type: 'switch',
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return !!data.destroyOnClose;
      //     },
      //     set({ data }: EditorResult<Data>, val: boolean) {
      //       data.destroyOnClose = val
      //     }
      //   }
      // },
      {
        title: '工具条',
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
      },
      {
        title: '事件',
        items: [
          {
            title: '关闭回调',
            type: '_Event',
            options: {
              outputId: OutputIds.AfterClose,
              slotId: SlotIds.Container
            }
          },
        ]
      },
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
  '[data-btn-id]': {
    title: '按钮',
    items: ({ }: EditorResult<Data>, cate1, cate2) => {
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
              output.setTitle(`${res.id}Click`, `点击${value}`);
              if (res.dynamicDisabled) {
                input.setTitle(`disable${res.id}`, `禁用-${value}按钮`);
                input.setTitle(`enable${res.id}`, `启用-${value}按钮`);
              }
              if (res.dynamicHidden) {
                input.setTitle(`hidden${res.id}`, `隐藏-${value}按钮`);
                input.setTitle(`show${res.id}`, `显示-${value}按钮`);
              }
              slot.get(SlotIds.Container).outputs.setTitle(res.id, `${value}`);
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
              title: '点击自动关闭对话框',
              description: '开启时, 单击按钮会自动关闭对话框。特殊处理：当需要向外输出数据时, 对话框在数据输出后关闭。',
              type: 'switch',
              value: {
                get({ data, focusArea }: EditorResult<Data>) {
                  return get(data, focusArea, 'btnId', 'autoClose');
                },
                set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                  const res = get(data, focusArea, 'btnId', 'obj');
                  res.autoClose = value;
                }
              }
            },
            {
              title: '单击',
              type: '_Event',

              options: ({ data, focusArea }: EditorResult<Data>) => {
                const res = get(data, focusArea, 'btnId', 'id');
                return {
                  outputId: `${res}Click`,
                  slotId: SlotIds.Container
                };
              }
            }
          ]
        },
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
                removeBtn({ data, input, output, slot }, res.id);
              } else {
                addBtn({ data, input, output, slot }, res.id);
              }
            }
          }
        },
        moveDelete('btnId')
      ];

      cate2.title = '高级';
      cate2.items = [
        useDynamic('btnId'),
      ];

    }
  },
  '.ant-modal-title': {
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
            if (isEmptyString(value)) {
              data.title = value;
            }
          }
        }
      }
    ]
  },
  '.ant-modal-close': {
    title: '关闭按钮',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.closable;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.closable = value;
          }
        }
      }
    ]
  },
  '.ant-modal-footer': {
    title: '工具条',
    items: [
      {
        title: '显示',
        type: 'Switch',
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
        title: '对齐方式',
        type: 'Select',
        options: [
          { value: AlignEnum.FlexStart, label: '居左' },
          { value: AlignEnum.Center, label: '居中' },
          { value: AlignEnum.FlexEnd, label: '居右' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.footerLayout;
          },
          set({ data }: EditorResult<Data>, value: AlignEnum) {
            data.footerLayout = value;
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
              removeBtn({ data, input, output, slot }, DefaultEvent[0])
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
              removeBtn({ data, input, output, slot }, DefaultEvent[1]);
            } else {
              addBtn({ data, input, output, slot }, DefaultEvent[1]);
            }
          }
        }
      },
      {
        title: '新增操作',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.footerBtns;
        },
        type: 'Button',
        value: {
          set({ data, input, output, slot }: EditorResult<Data>) {
            addBtn({ data, input, output, slot });
          }
        }
      }
    ]
  },
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
          const id = get(data, focusArea, dataset, 'obj')?.id;
          return !DefaultEvent.includes(id);
        },
        value: {
          set({ data, focusArea, input, output, slot }: EditorResult<Data>) {
            removeBtn({ data, input, output, slot }, get(data, focusArea, dataset, 'obj')?.id);
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
        title: '加载动画',
        type: 'Switch',
        description: '开启后点击按钮展示加载动画，动画需手动连线关闭',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, dataset, 'useBtnLoading');
          },
          set({ data, input, focusArea }: EditorResult<Data>, value: boolean) {
            const res = get(data, focusArea, dataset, 'obj');
            const schema = {
              type: 'any'
            };
            if (value) {
              input.add(`stopLoading${res.id}`, `关闭-${res.title}加载动画`, schema);
            } else {
              input.remove(`stopLoading${res.id}`);
            }
            res.useBtnLoading = value;
          }
        }
      },
    ]
  };
}

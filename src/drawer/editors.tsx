import { Data, Location, InputIds, SlotIds } from './constants';
import { uuid } from '../utils';

export default {
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
              set({ data }: EditorResult<Data>, value: boolean) {
                data.useFooter = value;
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

    cate3.title = '高级';
    cate3.items = [
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
    ];

    return {
      title: '抽屉'
    };
  },
  '[data-btn-id]': ({}: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
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
            slots.get(SlotIds.Content).inputs.get(res.id).setTitle(`${value}事件`);
            slots.get(SlotIds.Content).outputs.get(res.id).setTitle(`${value}输出数据`);
            output.setTitle(res.id, value);
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
                slotId: SlotIds.Content
              };
            }
          }
        ]
      }
    ];
    return { title: '按钮' };
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

function addBtn({ data, input, output, slots }: EditorResult<Data>) {
  const { footerBtns } = data;
  const id = uuid();
  const title = `按钮${footerBtns.length + 1}`;
  const schema = {
    type: 'any'
  };

  const defaultBtn: any = {
    id,
    title,
    icon: '',
    useIcon: false,
    showText: true,
    type: 'default',
    outputDs: false
  };

  data.footerBtns.unshift(defaultBtn);
  slots.get(SlotIds.Content).outputs.add(id, `${title}按钮输出数据`, schema);
  output.add(id, title, schema);
  input.get(InputIds.Open).setRels(data.footerBtns.map(({ id }) => id));
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
          set({ data, focusArea, input, output, slots }: EditorResult<Data>) {
            get(data, focusArea, dataset, 'obj', (index: number) => {
              const { id } = data.footerBtns[index];
              slots.get(SlotIds.Content).inputs.remove(id);
              slots.get(SlotIds.Content).outputs.remove(id);
              output.remove(id);
              data.footerBtns.splice(index, 1);
              input.get(InputIds.Open).setRels(data.footerBtns.map(({ id }) => id));
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

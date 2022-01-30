import { isEmptyString, uuid } from '../utils';
import { FOOTER_CONTENT_TYPE, Data, Location } from './constants';

export default {
  ':root': [
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
          title: '类型',
          type: 'Select',
          ifVisible({ data }) {
            return data.useFooter;
          },
          options: [
            {
              label: '按钮组',
              value: FOOTER_CONTENT_TYPE.BUTTONS
            },
            {
              label: '插槽',
              value: FOOTER_CONTENT_TYPE.SLOT
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.footerType || FOOTER_CONTENT_TYPE.BUTTONS;
            },
            set({ data }: EditorResult<Data>, value: number) {
              data.footerType = value;
            }
          }
        }
      ]
    },
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
    },
    {
      title: '事件',
      items: [
        {
          title: '关闭',
          type: '_Event',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.closable;
          },
          options: () => {
            return {
              outputId: 'cancel'
            };
          }
        }
      ]
    }
  ],
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
    title: '底部内容',
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
        title: '新增操作',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.footerBtns;
        },
        type: 'Button',
        value: {
          set({ data, output }: EditorResult<Data>) {
            addBtn({ data, output });
          }
        }
      }
    ]
  },
  '[data-btn-id]': {
    title: '按钮',
    items: [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return get(data, focusArea, 'btnId', 'title');
          },
          set(
            { data, focusArea, output, input }: EditorResult<Data>,
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
      useDynamic('btnId'),
      {
        title: '事件',
        items: [
          {
            title: '单击',
            type: '_Event',
            options: ({ data, focusArea }: EditorResult<Data>) => {
              const res = get(data, focusArea, 'btnId', 'id');
              return {
                outputId: res
              };
            }
          }
        ]
      },
      moveDelete('btnId')
    ]
  }
};

function addBtn({ data, output }: { data: Data; output: any }) {
  const { footerBtns } = data;
  const id = uuid(),
    title = `按钮${footerBtns.length + 1}`;
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
  data.footerBtns.unshift(defaultBtn);
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
          set({ data, output }: EditorResult<Data>) {
            addBtn({ data, output });
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
          set({ data, focusArea, output }: EditorResult<Data>) {
            get(data, focusArea, dataset, 'obj', (index) => {
              output.remove(data.footerBtns[index].id);
              data.footerBtns.splice(index, 1);
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
              type: 'follow'
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
              type: 'follow'
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

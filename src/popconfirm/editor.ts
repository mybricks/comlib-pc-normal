import { Data } from './types';
const setSlotLayout = (slot, val) => {
  if (!slot) return;
  if (val.position === 'smart') {
    slot.setLayout('smart');
  } else if (val.position === 'absolute') {
    slot.setLayout(val.position);
  } else if (val.display === 'flex') {
    if (val.flexDirection === 'row') {
      slot.setLayout('flex-row');
    } else if (val.flexDirection === 'column') {
      slot.setLayout('flex-column');
    }
  }
};
export default {
  ':slot': {},
  '@init': ({ data, style }: EditorResult<Data>) => {
    style.width = 'fit-content';
  },
  '@resize': {
    options: ['width']
  },
  ':root'({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '布局',
        type: 'layout',
        options: [],
        value: {
          get({ data, slots }: EditorResult<Data>) {
            const { slotStyle = {} } = data;
            return slotStyle;
          },
          set({ data, slots }: EditorResult<Data>, val: any) {
            if (!data.slotStyle) {
              data.slotStyle = {};
            }
            data.slotStyle = {
              ...data.slotStyle,
              ...val
            };
            const slotInstance = slots.get('carrier');
            setSlotLayout(slotInstance, val);
          }
        }
      },
      {
        title: '标题',
        type: 'text',
        options: {
          locale: true
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.title;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.title = val;
          }
        },
        binding: {
          with: 'data.title',
          schema: {
            type: 'string'
          }
        }
      },
      {
        title: '确认按钮文字',
        type: 'text',
        options: {
          locale: true
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.okText;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.okText = val;
          }
        }
      },
      {
        title: '取消按钮文字',
        type: 'text',
        options: {
          locale: true
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.cancelText;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.cancelText = val;
          }
        }
      },
      {
        title: '图标',
        type: 'icon',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.icon;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.icon = val;
          }
        }
      },
      {
        title: '是否显示取消按钮',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.showCancel;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.showCancel = val;
          }
        }
      },
      {
        title: '编辑态浮层触发方式',
        type: 'Select',
        options: [
          { value: 'hover', label: '悬浮' },
          { value: 'click', label: '点击' },
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.trigger;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.trigger = val;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '点击确认',
            type: '_event',
            options: {
              outputId: 'onOk'
            }
          },
          {
            title: '点击取消',
            type: '_event',
            options: {
              outputId: 'onCancel'
            }
          }
        ]
      }
    ];
  },
  '.ant-popover-buttons .ant-btn-primary': {
    title: '确认按钮',
    items: (props: EditorResult<Data>, cate1) => {
      if (!props.focusArea) return;
      // const item = getFocusTab(props);
      cate1.title = '常规';
      cate1.items = [
        {
          title: '确认按钮文字',
          type: 'text',
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.okText;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.okText = val;
            }
          }
        }
      ];
    },
  },
  '.ant-popover-buttons .ant-btn-default': {
    title: '确认按钮',
    items: (props: EditorResult<Data>, cate1) => {
      if (!props.focusArea) return;
      // const item = getFocusTab(props);
      cate1.title = '常规';
      cate1.items = [
        {
          title: '取消按钮文字',
          type: 'text',
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.cancelText;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.cancelText = val;
            }
          }
        },
      ];
    },
  }

};

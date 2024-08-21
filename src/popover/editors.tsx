import { Data, Placement, Trigger } from './constants';

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
    style.height = 'fit-content';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items({ data }, ...cate) {
      cate[0].title = '配置';
      cate[0].items = [
        {
          title: '布局',
          type: 'layout',
          options: [],
          value: {
            get({ data, slots }: EditorResult<Data>) {
              const { slotStyle = {} } = data;
              const slotInstance = slots.get('carrier');
              setSlotLayout(slotInstance, slotStyle);
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
          title: '标题自定义',
          type: 'switch',
          description: '支持自定义标题组件渲染，请拖入组件作为标题',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.useTitleSlot;
            },
            set({ data, slot }: EditorResult<Data>, val: boolean) {
              if (val) {
                slot.add('title', '标题');
              } else {
                slot.remove('title');
              }
              data.useTitleSlot = val;
            }
          }
        },
        {
          title: '标题',
          type: 'Text',
          options: {
            locale: true
          },
          ifVisible({ data }: EditorResult<Data>) {
            return !data.useTitleSlot;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.title;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.title = val;
            }
          }
        },
        {
          title: '内容自定义',
          type: 'switch',
          description: '支持自定义内容组件渲染，请拖入组件作为内容',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.useContentSlot;
            },
            set({ data, slot }: EditorResult<Data>, val: boolean) {
              if (val) {
                slot.add('content', '内容');
              } else {
                slot.remove('content');
              }
              data.useContentSlot = val;
            }
          }
        },
        {
          title: '内容',
          type: 'Text',
          options: {
            locale: true
          },
          ifVisible({ data }: EditorResult<Data>) {
            return !data.useContentSlot;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.content;
            },
            set({ data }: EditorResult<Data>, val: string) {
              data.content = val;
            }
          }
        },
        {
          title: '隐藏气泡弹出层面板',
          description: '仅在搭建时,开启标题自定义或内容自定义下设置生效',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.useTitleSlot || data.useContentSlot;
          },
          value: {
            get({ data }) {
              return data.hidePopupPanel || false;
            },
            set({ data, slot }: EditorResult<Data>, value: boolean) {
              data.hidePopupPanel = value;
            }
          }
        },
        {
          title: '触发方式',
          type: 'Select',
          options: [
            {
              label: '悬浮',
              value: 'hover'
            },
            {
              label: '点击',
              value: 'click'
            },
            {
              label: '聚焦',
              value: 'focus'
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.trigger;
            },
            set({ data }: EditorResult<Data>, val: Trigger) {
              data.trigger = val;
            }
          }
        },
        {
          title: '方向',
          type: 'select',
          options: [
            {
              label: '左上',
              value: 'leftTop'
            },
            {
              label: '上',
              value: 'top'
            },
            {
              label: '右上',
              value: 'rightTop'
            },
            {
              label: '左下',
              value: 'leftBottom'
            },
            {
              label: '下',
              value: 'bottom'
            },
            {
              label: '右下',
              value: 'rightBottom'
            },
            {
              label: '左上角',
              value: 'topLeft'
            },
            {
              label: '左',
              value: 'left'
            },
            {
              label: '左下角',
              value: 'bottomLeft'
            },
            {
              label: '右上角',
              value: 'topRight'
            },
            {
              label: '右',
              value: 'right'
            },
            {
              label: '右下角',
              value: 'bottomRight'
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.placement;
            },
            set({ data }: EditorResult<Data>, val: Placement) {
              data.placement = val;
            }
          }
        }
      ];
    },
    style: [
      {
        title: '容器',
        options: [
          {
            type: 'background',
            config: {
              disableBackgroundImage: true
            }
          },
          'border',
          'size'
        ],
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id}.ant-popover .ant-popover-inner`;
        },
        domTarget: '.ant-popover .ant-popover-inner'
      },
      {
        title: '标题',
        options: ['font', 'padding', 'border'],
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id}.ant-popover .ant-popover-inner .ant-popover-title`;
        },
        domTarget: '.ant-popover .ant-popover-inner .ant-popover-title'
      },
      {
        title: '内容',
        options: ['font', 'padding'],
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id}.ant-popover .ant-popover-inner .ant-popover-inner-content`;
        },
        domTarget: '.ant-popover .ant-popover-inner .ant-popover-inner-content'
      },
      {
        title: '箭头',
        options: [
          {
            type: 'background',
            config: {
              disableBackgroundImage: true,
              keyMap: {
                backgroundColor: '--antd-arrow-background-color'
              }
            }
          }
        ],
        initValue: {
          '--antd-arrow-background-color': '#ffffff'
        },
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id}.ant-popover .ant-popover-arrow .ant-popover-arrow-content`;
        }
      }
    ]
  }
};

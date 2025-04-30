import { Data } from './runtime';
import { SpinSize } from 'antd/es/spin';

interface Result {
  data: Data;
  focusArea?: any;
  output: any;
  input: any;
}

export default {
  ':slot': {},
  '@resize': {
    options: ['width', 'height']
  },
  '@init': ({ style }) => {
    //style.height = 'fit-content'
  },
  ':root': [
    {
      title: '加载图标大小',
      type: 'Select',
      options: [
        { label: '大', value: 'large' },
        { label: '中', value: 'default' },
        { label: '小', value: 'small' }
      ],
      value: {
        get({ data }: Result) {
          return data.size || 'default';
        },
        set({ data }: Result, value: SpinSize) {
          data.size = value;
        }
      }
    },
    {
      title: '描述文案',
      type: 'Text',
      options: {
        locale: true
      },
      value: {
        get({ data }: Result) {
          return data.tip || '加载中';
        },
        set({ data }: Result, value: string) {
          data.tip = value;
        }
      }
    },
    null,
    {
      title: '布局',
      type: 'layout',
      options: [],
      value: {
        get({ data, slots }: EditorResult<Data>) {
          const { slotStyle = {} } = data;
          const contentSlot = slots.get('content');

          setSlotLayout(contentSlot, slotStyle);
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

          const slotInstance = slots.get('content');
          setSlotLayout(slotInstance, val);
        }
      }
    }
  ]
};

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

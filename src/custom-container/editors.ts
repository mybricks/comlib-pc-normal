import { Data, SlotIds } from './constants';
import { OverflowEditor } from './editors/overflowEditor';
import { PageScrollEditor } from './editors/pageSrcollEditor';
import { StyleEditor } from './editors/styleEditor';
import { ClickEditor } from './editors/clickEditor';
import { MaxHeightEditor } from './editors/maxHeightEditor';
import { FixedEditor } from './editors/fixedEditor';

const setSlotLayout = (slot, val) => {
  if(!slot) return;
  if (val.position === 'absolute') {
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
  '@init'({ style }: EditorResult<Data>) {
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': ({ slot }: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '样式',
        items: StyleEditor
      }
    ];

    cate2.title = '布局';
    cate2.items = [
      {
        title: '自动布局',
        type: 'layout',
        options: [],
        value: {
          get({ data, slots }: EditorResult<Data>) {
            const { slotStyle = {} } = data;
            const slotInstance = slots.get('content');
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
            const slotInstance = slots.get('content');
            setSlotLayout(slotInstance, val);
          }
        }
      },
      ...MaxHeightEditor,
      ...OverflowEditor,
      ...FixedEditor
    ];

    cate3.title = '高级';
    cate3.items = [...ClickEditor, ...PageScrollEditor];

    return {
      title: '自定义容器'
    };
  }
};

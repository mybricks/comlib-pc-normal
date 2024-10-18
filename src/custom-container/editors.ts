import { Data, SlotIds, OverflowEnum } from './constants';
import { OverflowEditor } from './editors/overflowEditor';
import { PageScrollEditor } from './editors/pageSrcollEditor';
import { AutoScrollEditor } from './editors/autoScrollEditor';
import { StyleEditor } from './editors/styleEditor';
import { EventEditor } from './editors/eventEditor';
import { MaxHeightEditor } from './editors/maxHeightEditor';
import { FixedEditor } from './editors/fixedEditor';
import { getFilterSelector } from '../utils/cssSelector';
import { unitConversion } from '../utils';

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
  '@init'({ style, data, slot }: EditorResult<Data>) {
    style.height = 'auto';

    if (window._disableSmartLayout) {
      data.slotStyle = {
        alignItems: 'flex-start',
        columnGap: 0,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        position: 'inherit',
        rowGap: 0
      };
    }
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items({ slot }: EditorResult<Data>, cate1, cate2, cate3) {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '布局',
          type: 'layout',
          description: '设置布局方式，包括智能布局、纵向排版、横向排版、自由布局',
          options: [],
          value: {
            get({ data, slots }: EditorResult<Data>) {
              const { slotStyle = {} } = data;
              const slotInstance = slots.get('content');
              setSlotLayout(slotInstance, slotStyle);
              return slotStyle;
            },
            set({ data, slots }: EditorResult<Data>, val: any) {
              console.log('set', val);
              data.slotStyle = val;
              const slotInstance = slots.get('content');
              setSlotLayout(slotInstance, val);
            }
          }
        },
        ...EventEditor,
        ...AutoScrollEditor,
        ...PageScrollEditor,
      ];

      // cate2.title = '交互';
      // cate2.items = [...EventEditor, ...AutoScrollEditor, ...PageScrollEditor];

      return {
        title: '自定义容器'
      };
    },
    style: [
      MaxHeightEditor,
      // OverflowEditor,
      ...FixedEditor,
      {
        items: [
          {
            title: '默认',
            catelog: '默认',
            options: ['padding', 'border', 'background', 'overflow', 'BoxShadow'],
            target: ({ id }: EditorResult<Data>) => `> .root`
          },
          {
            title: 'Hover',
            catelog: 'Hover',
            options: ['padding', 'border', 'background', 'BoxShadow'],
            target: ({ id }: EditorResult<Data>) => `> .root:hover`,
            domTarget: '.root'
          }
        ]
      }
    ]
  }
};

import { Data } from '../../constants';
import IndexEditor from './indexEditor';
import StyleEditor from './styleEditor';
import WidthEditor from './widthEditor';
import EventEditor from './eventEditor';
import { getColItem, setSlotLayout } from '../utils';
import React from 'react';

export default {
  '[data-type-col]': {
    title: '列',
    items: ({ data, focusArea, slot }: EditorResult<Data>, cate1, cate2, cate3) => {
      if (!focusArea) return;
      const item = getColItem(data, focusArea);
      const slotInstance = slot.get(item.slot);
      cate1.title = '常规';
      cate1.items = [
        ...WidthEditor(item),
        {
          title: '自动布局',
          type: 'layout',
          options: [],
          value: {
            get({ data, focusArea, slot }: EditorResult<Data>) {
              if (!focusArea) return;
              // const item = getColItem(data, focusArea);
              // const slotInstance = slot.get(item.slot);
              setSlotLayout(slotInstance, item.slotStyle);
              const { slotStyle = {} } = item;
              return slotStyle;
            },
            set({ data, focusArea, slot }: EditorResult<Data>, val: React.CSSProperties) {
              if (!focusArea) return;
              // const item = getColItem(data, focusArea);
              if (!item.slotStyle) {
                item.slotStyle = {};
              }
              item.slotStyle = {
                ...item.slotStyle,
                ...val
              };
              // const slotInstance = slot.get(item.slot);
              setSlotLayout(slotInstance, val);
            }
          }
        },
        ...IndexEditor(item)
      ];

      cate2.title = '样式';
      cate2.items = [...StyleEditor(item)];

      cate3.title = '事件';
      cate3.items = [...EventEditor(item)];
    }
  }
};

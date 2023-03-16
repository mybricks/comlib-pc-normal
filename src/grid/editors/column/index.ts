import { Data } from '../../constants';
import IndexEditor from './indexEditor';
import StyleEditor from './styleEditor';
import WidthEditor from './widthEditor';
import EventEditor from './eventEditor';
import { getColItem } from '../utils';
import React from 'react';

export default {
  '[data-type-col]': ({ focusArea }: EditorResult<Data>, cate1, cate2, cate3) => {
    if (!focusArea) return;
    cate1.title = '常规';
    cate1.items = [
      ...WidthEditor,
      {
        title: '自动布局',
        type: 'layout',
        options: [],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            const { slotStyle = {} } = item;
            return slotStyle;
          },
          set({ data, focusArea, slot }: EditorResult<Data>, val: React.CSSProperties) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            if (!item.slotStyle) {
              item.slotStyle = {};
            }
            item.slotStyle = {
              ...item.slotStyle,
              ...val
            };
            const slotInstance = slot.get(item.slot);
            if (val.position === 'absolute') {
              slotInstance.setLayout(val.position);
            } else if (val.display === 'flex') {
              if (val.flexDirection === 'row') {
                slotInstance.setLayout('flex-row');
              } else if (val.flexDirection === 'column') {
                slotInstance.setLayout('flex-column');
              }
            }
          }
        }
      },
      ...IndexEditor
    ];

    cate2.title = '样式';
    cate2.items = [...StyleEditor];

    cate3.title = '事件';
    cate3.items = [...EventEditor];

    return {
      title: '列'
    };
  }
};

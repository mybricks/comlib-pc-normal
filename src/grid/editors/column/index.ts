import React from 'react';
import { Data } from '../../constants';
import IndexEditor from './indexEditor';
import StyleEditor from './styleEditor';
import WidthEditor from './widthEditor';
import EventEditor from './eventEditor';
import { getColItem, setSlotLayout, createStyleForCol } from '../utils';
import { getFilterSelector } from '../../../utils/cssSelector'

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
              setSlotLayout(slotInstance, item.slotStyle);
              const { slotStyle = {} } = item;
              return slotStyle;
            },
            set({ data, focusArea, slot }: EditorResult<Data>, val: React.CSSProperties) {
              if (!focusArea) return;
              if (!item.slotStyle) {
                item.slotStyle = {};
              }
              item.slotStyle = {
                ...item.slotStyle,
                ...val
              };
              setSlotLayout(slotInstance, val);
            }
          }
        },
        ...IndexEditor(item)
      ];

      cate2.title = '高级';
      cate2.items = [...StyleEditor(item), ...EventEditor(item)];
    },
    style: createStyleForCol({
      target({ id, focusArea }: EditorResult<Data>) {
        return `.root > .ant-row > div[data-col-coordinate="${focusArea.dataset.colCoordinate}"]${getFilterSelector(id)}`;
      }
    })
  }
};

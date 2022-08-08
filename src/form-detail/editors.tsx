import { Data } from './constants';
import { BaseEditor } from './editors/baseEditor';
import { ItemsEditors } from './editors/item';
import { StyleEditor } from './editors/styleEditor';
import { SlotPropsEditor } from './editors/slotPropsEditor';

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [...BaseEditor];

    cate2.title = '样式';
    cate2.items = [...StyleEditor];

    cate3.title = '高级';
    cate3.items = [...SlotPropsEditor];

    return { title: '描述列表' };
  },
  ...ItemsEditors
};

import { Data } from './constants';
import { BaseEditor } from './editors/baseEditor';
import { ItemsEditors } from './editors/item';
import { StyleEditor } from './editors/styleEditor';

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [...BaseEditor];

    cate2.title = '样式';
    cate2.items = [...StyleEditor];

    return { title: '描述列表' };
  },
  ...ItemsEditors
};

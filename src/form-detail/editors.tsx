import { Data, InputIds } from './constants';
import { BaseEditor } from './editors/baseEditor';
import { ItemsEditors } from './editors/item';

export default {
  ':root': ({}: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [...BaseEditor];

    return { title: '描述列表' };
  },
  ...ItemsEditors
};

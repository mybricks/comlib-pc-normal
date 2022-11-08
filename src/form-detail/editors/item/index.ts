import { Data } from '../../constants';
import { StyleEditor } from './styleEditor';
import { BaseEditor } from './baseEditor';
import { IndexEditor } from './indexEditor';

const itemKey = '.ant-descriptions-item';
export const ItemsEditors = {
  [itemKey]: ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [...BaseEditor, ...IndexEditor];

    cate2.title = '样式';
    cate2.items = [...StyleEditor];

    return { title: '描述项' };
  }
};

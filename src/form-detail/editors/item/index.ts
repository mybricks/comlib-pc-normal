import { Data } from '../../constants';
import { StyleEditor } from './styleEditor';
import { BaseEditor } from './baseEditor';
import { IndexEditor } from './indexEditor';
import { LogicEditor } from './logicEditor';
import { SuffixEditor } from './suffixEditor';

const itemKey = '.ant-descriptions-item';
export const ItemsEditors = {
  [itemKey]: ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [...BaseEditor, ...IndexEditor];

    cate2.title = '样式';
    cate2.items = [...StyleEditor];

    cate3.title = '高级';
    cate3.items = [...SuffixEditor, ...LogicEditor];

    return { title: '表单项配置' };
  }
};

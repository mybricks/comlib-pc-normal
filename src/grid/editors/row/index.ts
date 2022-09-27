import { Data } from '../../constants';
import IndexEditor from './indexEditor';
import LayoutEditor from './layoutEditor';
import StyleEditor from './styleEditor';

export default {
  '[data-type-row]': ({ }: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
    cate1.items = [...LayoutEditor, ...IndexEditor];

    cate2.title = '样式';
    cate2.items = [...StyleEditor];

    return {
      title: '行'
    };
  }
};

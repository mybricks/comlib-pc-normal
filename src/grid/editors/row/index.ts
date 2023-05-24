import { Data } from '../../constants';
import IndexEditor from './indexEditor';
import LayoutEditor from './layoutEditor';
import StyleEditor from './styleEditor';

export default {
  '[data-type-row]': {
    title: "行",
    items: ({ }: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [...LayoutEditor, ...StyleEditor, ...IndexEditor];
  
      // cate2.title = '样式';
      // cate2.items = [...StyleEditor];
    },
    style: {
      options: ['BgColor'],
      target({focusArea}) {
        return `div[data-row-index=${JSON.stringify(focusArea.dataset.rowIndex)}]`
      }
    }
  }
};

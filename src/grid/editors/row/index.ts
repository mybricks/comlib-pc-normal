import { Data } from '../../constants';
import IndexEditor from './indexEditor';
import LayoutEditor from './layoutEditor';
import StyleEditor from './styleEditor';
import { getRowItem } from '../utils';

export default {
  '[data-type-row]': {
    title: '行',
    items: ({ data, focusArea }: EditorResult<Data>, cate1, cate2) => {
      if (!focusArea) return;
      const row = getRowItem(data, focusArea);
      cate1.title = '常规';
      cate1.items = [...LayoutEditor(row), ...StyleEditor(row), ...IndexEditor];
    },
    style: {
      options: ['BgColor']
    }
  }
};

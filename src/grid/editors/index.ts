import { Data } from '../constants';
import AddRowEditor from './addRowEditor';
import StyleEditor from './styleEditor';
import RowItemEditor from './row';
import ColumnItemEditor from './column';

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
    cate1.items = [...AddRowEditor];

    cate2.title = '样式';
    cate2.items = [...StyleEditor];

    return {
      title: '栅格布局'
    };
  },
  ...RowItemEditor,
  ...ColumnItemEditor
};

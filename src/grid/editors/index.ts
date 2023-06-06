import { Data } from '../constants';
import AddRowEditor from './addRowEditor';
import StyleEditor from './styleEditor';
import RowItemEditor from './row';
import ColumnItemEditor from './column';

export default {
  ':root': {
    items: ({}: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [...AddRowEditor];
      return {
        title: '栅格布局'
      };
    },
    style: [
      {
        title: '容器',
        options: ['BgColor', 'Border', 'BgImage', 'size'],
        target: ':root'
      },
      {
        title: '单元格',
        options: ['BgColor', 'Border', 'BgImage', 'Padding', 'size'],
        target: `.ant-row .ant-col`
      }
    ]
  },
  ...RowItemEditor,
  ...ColumnItemEditor
};

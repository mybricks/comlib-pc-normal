import { Data } from '../constants';
import AddRowEditor from './addRowEditor';
import StyleEditor from './styleEditor';
import RowItemEditor from './row';
import ColumnItemEditor from './column';
import { createStyleForGrid, createStyleForCol } from './utils';
import { getFilterSelector } from '../../utils/cssSelector';

export default {
  ':slot': {},
  ':root': {
    items: ({ }: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [...AddRowEditor];
      return {
        title: '栅格布局'
      };
    },
    style: [
      createStyleForGrid({
        target: ({ id }: EditorResult<Data>) => `.root${getFilterSelector(id)}`
      }),
      createStyleForCol({
        target: ({ id }: EditorResult<Data>) =>
          `.root > .ant-row > .ant-col${getFilterSelector(id)}`
      })
    ]
  },
  ...RowItemEditor,
  ...ColumnItemEditor
};

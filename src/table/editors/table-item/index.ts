import { COLUMN_EDITORS_CLASS_KEY } from '../../constants';
import { Data } from '../../types';
import GroupEditor from './item/group';
import IndexEditor from './indexEditor';
import SortEditor from './sortEditor';
import FilterEditor from './filterEditor';
import createBaseEditor from './baseEditor';
import TitleTipEditor from './titleTipEditor';
import StyleEditor from './styleEditor';
import { createStyleForHead, createStyleForContent } from '../../utils';

const column = {
  [COLUMN_EDITORS_CLASS_KEY]: {
    title: '表格列',
    items: ({ data }: EditorResult<Data>, ...cateAry) => {
      cateAry[0].title = '常规';
      cateAry[0].items = [
        createBaseEditor({ data }),
        GroupEditor,
        ...StyleEditor,
        TitleTipEditor,
        ...IndexEditor
      ];
      // cateAry[1].title = '样式';
      // cateAry[1].items = [...StyleEditor, TitleTipEditor];

      cateAry[1].title = '高级';
      cateAry[1].items = [SortEditor, FilterEditor];
      return {
        title: '表格列'
      };
    },
    style: [
      createStyleForHead({
        target({ data, focusArea }: EditorResult<Data>) {
          const { tableThIdx } = focusArea.dataset;
          const selector = `thead tr th[data-table-th-idx="${tableThIdx}"]`;
          return selector;
        }
      }),
      createStyleForContent({
        target({ data, focusArea }: EditorResult<Data>) {
          const { tableThIdx } = focusArea.dataset;
          const selector = `tbody tr td[data-table-column-id="${tableThIdx}"]`;
          return selector;
        }
      })
    ]
  }
};

export default column;

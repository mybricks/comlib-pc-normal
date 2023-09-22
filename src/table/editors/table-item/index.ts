import { COLUMN_EDITORS_CLASS_KEY } from '../../constants';
import { getFilterSelector } from '../../../utils/cssSelector';
import { Data } from '../../types';
import GroupEditor from './item/group';
import IndexEditor from './indexEditor';
import SortEditor from './sortEditor';
import FilterEditor from './filterEditor';
import createBaseEditor from './baseEditor';
import TitleTipEditor from './titleTipEditor';
import StyleEditor from './styleEditor';
import { createStyleForColumnContent } from '../../utils';

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
      // {
      //   title: '开启斑马纹',
      //   type: 'Switch',
      //   description: '配置表格的单双行为不同样式',
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.enableStripe;
      //     },
      //     set({ data }: EditorResult<Data>, value: boolean) {
      //       data.enableStripe = value;
      //     }
      //   }
      // },
      {
        title: '单行',
        ifVisible({ data }: EditorResult<Data>) {
          return data.enableStripe;
        },
        options: [{ type: 'background', config: { disableBackgroundImage: true } }],
        target: ({ id, focusArea }) => {
          const { tableThIdx } = focusArea.dataset;
          return `table tbody tr.mybricks-table-row-single td[data-table-column-id="${tableThIdx}"]${getFilterSelector(id)}`
        }
      },
      {
        title: '双行',
        ifVisible({ data }: EditorResult<Data>) {
          return data.enableStripe;
        },
        options: [{ type: 'background', config: { disableBackgroundImage: true } }],
        target: ({ id, focusArea }) => {
          const { tableThIdx } = focusArea.dataset;
          return `table tbody tr.mybricks-table-row-double td[data-table-column-id="${tableThIdx}"]${getFilterSelector(id)}`
        }
      },
      {
        title: '表头',
        catelog: '默认',
        options: ['font', 'border', { type: 'background', config: { disableBackgroundImage: true } }],
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.columns.length;
        },
        target: ({ data, focusArea, id }: EditorResult<Data>) => {
          const { tableThIdx } = focusArea.dataset;
          const selector = `table thead tr th[data-table-th-idx="${tableThIdx}"]${getFilterSelector(id)}`;
          return selector;
        }
      },
      // createStyleForHead({
      //   target({ data, focusArea, id }: EditorResult<Data>) {
      //     const { tableThIdx } = focusArea.dataset;
      //     const selector = `table thead tr th[data-table-th-idx="${tableThIdx}"]${getFilterSelector(id)}`;
      //     return selector;
      //   }
      // }),
      createStyleForColumnContent({
        target({ data, focusArea, id }: EditorResult<Data>) {
          const { tableThIdx } = focusArea.dataset;
          const selector = `table tbody tr td[data-table-column-id="${tableThIdx}"]${getFilterSelector(id)}`;
          return selector;
        }
      })
    ]
  }
};

export default column;

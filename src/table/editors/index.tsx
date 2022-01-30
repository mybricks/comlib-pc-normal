import {
  setDataSchema,
  getRefreshSchema,
  getSingleDataSourceSchema,
  getColumnsDataSchema,
  setPaginationSchema
} from '../schema';
import columnEditor from './table-item';
import { InputIds } from '../constants';
import {
  batchActionBtnsEditor,
  colActionBtnsEditor,
  headerActionBtnsEditor
} from './actionBtns';
import headerEditor from './table/header';
import headerTitleEditor from './table/headerTitle';
import paginationEditor from './table/pagination';
import { rowSelectionEditor } from './table/rowSelection';
import { columnDataUpdateEditor } from './table/columnDataUpdate';
import tableStyleEditor from './table/tableStyle';
import { dragEditor } from './table/drag';
import addColumnEditor from './table/addColumn';
import { expandEditor } from './table/expand';
import { Data } from '../types';
import { CodeEditor } from './table/codeEditor';

function addDataSourceInput({ input, columns }) {
  const dataSchema = getColumnsDataSchema(columns);
  const title = '输入数据';
  const schema = getSingleDataSourceSchema(dataSchema);

  if (!input.get(InputIds.SET_DATA_SOURCE)) {
    input.add(InputIds.SET_DATA_SOURCE, title, schema);
  }
}

function addRefreshInput({ input }) {
  const refreshTitle = '刷新';
  const refreshSchema = getRefreshSchema();
  if (!input.get(InputIds.REFRESH)) {
    input.add(InputIds.REFRESH, refreshTitle, refreshSchema);
  }
}

export default {
  '@init': ({ data, output, input }: EditorResult<Data>) => {
    addRefreshInput({ input });
    addDataSourceInput({ input, columns: data.columns });
    setDataSchema({ data, output, input });
    setPaginationSchema({ data, output });
  },
  ':root': ({}: EditorResult<Data>, ...cateAry) => {
    cateAry[0].title = '常规';
    cateAry[0].items = [addColumnEditor, headerEditor, paginationEditor];

    cateAry[1].title = '样式';
    cateAry[1].items = [tableStyleEditor];

    cateAry[2].title = '高级';
    cateAry[2].items = [
      // {
      //   title: '事件',
      //   items: [
      //     {
      //       title: '表格数据输出',
      //       type: '_Event',
      //       options: () => {
      //         return {
      //           outputId: OutputIds.GET_TABLE_DATA
      //         };
      //       }
      //     }
      //   ]
      // },
      ...rowSelectionEditor,
      ...dragEditor,
      ...columnDataUpdateEditor,
      ...expandEditor,
      ...CodeEditor
    ];
  },
  '.ant-pagination': paginationEditor,
  ...columnEditor,
  ...headerTitleEditor,
  ...colActionBtnsEditor,
  ...headerActionBtnsEditor,
  ...batchActionBtnsEditor
};

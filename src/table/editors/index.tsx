import {
  setDataSchema,
  getRefreshSchema,
  getSingleDataSourceSchema,
  getColumnsDataSchema,
  setPaginationSchema
} from '../schema';
import columnEditor from './table-item';
import { InputIds } from '../constants';
import { batchActionBtnsEditor, colActionBtnsEditor, headerActionBtnsEditor } from './actionBtns';

import headerEditor from './table/header';
import headerTitleEditor from './table/headerTitle';
import paginationEditor from './table/pagination';
import toolAreaEditor from './table/toolArea';
import { rowSelectionEditor } from './table/rowSelection';
import { columnDataUpdateEditor } from './table/columnDataUpdate';
import tableStyleEditor from './table/tableStyle';
import { dragEditor } from './table/drag';
import addColumnEditor from './table/addColumn';
import { expandEditor } from './table/expand';
import { CodeEditor } from './table/codeEditor';
import { refreshEditor } from './table/refresh';
import { dynamicColumnEditor } from './table/dynamicColumn';
import { submitEventEditor } from './table/submitEvent';
import { Data } from '../types';

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

function getColumnsFromSchema(schema: any) {
  function getColumnsFromSchemaProperties(properties) {
    const columns: any = [];
    Object.keys(properties).forEach((key) => {
      if (properties[key].type === 'number' || properties[key].type === 'string') {
        columns.push({
          title: key,
          dataIndex: key,
          key,
          width: 140,
          visible: true,
          ellipsis: true,
          contentType: 'text'
        });
      }
    });
    return columns;
  }
  let columnSchema: any = {};
  if (schema.type === 'array') {
    columnSchema = schema.items.properties;
  } else if (schema.type === 'object') {
    const dataSourceKey = Object.keys(schema.properties).find(
      (key) => schema.properties[key].type === 'array'
    );
    if (dataSourceKey) {
      columnSchema = schema.properties[dataSourceKey].items.properties;
    }
  }
  return getColumnsFromSchemaProperties(columnSchema);
}

export default {
  '@init': ({ data, output, input }: EditorResult<Data>) => {
    addRefreshInput({ input });
    addDataSourceInput({ input, columns: data.columns });
    setDataSchema({ data, output, input });
    setPaginationSchema({ data, output });
  },
  '@inputConnected'({ data }, fromPin, toPin) {
    if (toPin.id === InputIds.SET_DATA_SOURCE) {
      const columns = getColumnsFromSchema(fromPin.schema);
      data.columns.forEach(column => {
        if (columns.some(item => item.dataIndex === column.dataIndex)) {
          return;
        }
        columns.push(column);
      })
      data.columns = columns;
      if (fromPin.schema.type === 'object' || fromPin.schema.type === 'array') {
        data[`input${InputIds.SET_DATA_SOURCE}Schema`] = fromPin.schema;
      } else {
        data[`input${InputIds.SET_DATA_SOURCE}Schema`] = {};
      }
    }
  },
  '@inputDisConnected'({ input }, fromPin, toPin) {
    if (toPin.id === InputIds.SET_DATA_SOURCE) {
      input.get(toPin.id).setSchema({ title: '列表数据', type: 'any' });
    }
  },
  ':root': (props: EditorResult<Data>, ...cateAry) => {
    cateAry[0].title = '常规';
    cateAry[0].items = [addColumnEditor, headerEditor, toolAreaEditor, paginationEditor];

    cateAry[1].title = '样式';
    cateAry[1].items = [tableStyleEditor];

    cateAry[2].title = '高级';
    cateAry[2].items = [
      // ...submitEventEditor,
      ...refreshEditor,
      ...rowSelectionEditor(props),
      ...dragEditor,
      ...columnDataUpdateEditor,
      ...dynamicColumnEditor,
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

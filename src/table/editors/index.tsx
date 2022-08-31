import { setDataSchema, getSingleDataSourceSchema } from '../schema';
import columnEditor from './table-item';
import { InputIds } from '../constants';
import { batchActionBtnsEditor, colActionBtnsEditor, headerActionBtnsEditor } from './actionBtns';
import headerEditor from './table/header';
import headerTitleEditor from './table/headerTitle';
import toolAreaEditor from './table/toolArea';
import { rowSelectionEditor } from './table/rowSelection';
import tableStyleEditor from './table/tableStyle';
import addColumnEditor from './table/addColumn';
import { expandEditor } from './table/expand';
import { EventEditor } from './table/event';
import { Data } from '../types';
import { uuid } from '../../utils';
import { LoadingEditor } from './table/loading';

function addDataSourceInput({ input, columns }) {
  if (!input.get(InputIds.SET_DATA_SOURCE)) {
    input.add(InputIds.SET_DATA_SOURCE, '设置数据源', getSingleDataSourceSchema(columns));
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
          key: uuid(),
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
    addDataSourceInput({ input, columns: data.columns });
    setDataSchema({ data, output, input });
  },
  '@inputConnected'({ data, input, output, slot }, fromPin, toPin) {
    if (toPin.id === InputIds.SET_DATA_SOURCE) {
      if (data.columns.length === 0) {
        data.columns = getColumnsFromSchema(fromPin.schema);
        if (fromPin.schema.type === 'array') {
          input.get(InputIds.SET_DATA_SOURCE).setSchema(fromPin.schema);
        }
      }

      if (fromPin.schema.type === 'object' || fromPin.schema.type === 'array') {
        data[`input${InputIds.SET_DATA_SOURCE}Schema`] = fromPin.schema;
      } else {
        data[`input${InputIds.SET_DATA_SOURCE}Schema`] = {};
      }
      setDataSchema({ data, output, input });
    }
  },
  '@inputDisConnected'({ data, input }, fromPin, toPin) {
    if (toPin.id === InputIds.SET_DATA_SOURCE && data.columns.length === 0) {
      input.get(toPin.id).setSchema({ title: '列表数据', type: 'any' });
    }
  },
  ':root': (props: EditorResult<Data>, ...cateAry) => {
    cateAry[0].title = '常规';
    cateAry[0].items = [addColumnEditor, headerEditor, toolAreaEditor];

    cateAry[1].title = '样式';
    cateAry[1].items = [...LoadingEditor, tableStyleEditor];

    cateAry[2].title = '高级';
    cateAry[2].items = [...EventEditor, ...rowSelectionEditor(props), ...expandEditor];
  },
  ...columnEditor,
  ...headerTitleEditor,
  ...colActionBtnsEditor,
  ...headerActionBtnsEditor,
  ...batchActionBtnsEditor
};

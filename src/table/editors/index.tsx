import { InputIds } from '../constants';
import { Data } from '../types';
import { uuid } from '../../utils';
import { setDataSchema, Schemas } from '../schema';
import columnEditor from './table-item';
import HeaderEditor from './table/header';
import TableStyleEditor from './table/tableStyle';
import AddColumnEditor from './table/addColumn';
import ExpandEditor from './table/expand';
import EventEditor from './table/event';
import LoadingEditor from './table/loading';
import { getRowSelectionEditor } from './table/rowSelection';

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
  '@inputConnected'({ data, output, input, ...res }: EditorResult<Data>, fromPin, toPin) {
    if (toPin.id === InputIds.SET_DATA_SOURCE) {
      if (data.columns.length === 0 && fromPin.schema.type === 'array') {
        data.columns = getColumnsFromSchema(fromPin.schema);
        input.get(InputIds.SET_DATA_SOURCE).setSchema(fromPin.schema);
        data[`input${InputIds.SET_DATA_SOURCE}Schema`] = fromPin.schema;
      }
      setDataSchema({ data, output, input, ...res });
    }
  },
  '@inputDisConnected'({ data, input }, fromPin, toPin) {
    if (toPin.id === InputIds.SET_DATA_SOURCE && data.columns.length === 0) {
      input.get(toPin.id).setSchema({ title: '列表数据', type: Schemas.Array });
    }
  },
  ':root': (props: EditorResult<Data>, ...cateAry) => {
    cateAry[0].title = '常规';
    cateAry[0].items = [AddColumnEditor];

    cateAry[1].title = '样式';
    cateAry[1].items = [...LoadingEditor, TableStyleEditor];

    cateAry[2].title = '高级';
    cateAry[2].items = [
      ...EventEditor,
      HeaderEditor,
      ...ExpandEditor,
      ...getRowSelectionEditor(props)
    ];
  },
  ...columnEditor
};

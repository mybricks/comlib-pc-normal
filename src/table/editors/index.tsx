import {InputIds} from '../constants';
import {Data} from '../types';
import {uuid} from '../../utils';
import {setDataSchema} from '../schema';
import columnEditor from './table-item';
import HeaderEditor from './table/header';
import TableStyleEditor from './table/tableStyle';
import getAddColumnEditor from './table/addColumn';
import ExpandEditor from './table/expand';
import EventEditor from './table/event';
import LoadingEditor from './table/loading';
import {getRowSelectionEditor} from './table/rowSelection';
import UsePaginatorEditor from './table/paginator';
import RowKeyEditor from './table/rowKey';
import PaginatorEditor from './paginator';
import DynamicColumnEditor from './table/dynamicColumn';
import DynamicTitleEditor from './table/dynamicTitle';
import rowOperationEditor from './table/rowOperation';
import SummaryColumn from './table/summaryColumn';
import ScrollToFirstRowEditor from './table/scrollToFirstRow';
import SummaryColumnEditor from './table-summary';
import rowSelectEditor from './rowSelect';
import rowExpandEditor from './rowExpand';
import rowTreeEditor from './rowTree';
import {emptyEditor, emptyStyleEditor} from './table/empty';
import {getColumnsSchema} from '../utils';
import {
  OutputIds as PaginatorOutputIds,
  InputIds as PaginatorInputIds
} from '../components/Paginator/constants';
import {PageSchema} from './table/paginator';
import rowMerge from './table/rowMerge';
import lazyLoad from './table/lazyLoad';
import filterIconDefault from './table/filterIconDefault';
// import { connectorEditor } from '../../utils/connector';
import {isSameDomainInstanceAndService} from "../../utils/domainModel";

export function getColumnsFromSchema(schema: any, values: Record<string, any> = {}) {
  const {defaultWidth = 140, ...other} = values;

  function getColumnsFromSchemaProperties(properties) {
    const columns: any = [];
    Object.keys(properties).forEach((key) => {
      if (
        properties[key].type === 'number' ||
        properties[key].type === 'string' ||
        properties[key].type === 'boolean'
      ) {
        columns.push({
          title: properties[key].description || properties[key].title || key,
          dataIndex: key,
          key: uuid(),
          width: defaultWidth,
          visible: true,
          ellipsis: true,
          contentType: 'text',
          ...other
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

const setDomainModel = ({data, key, _domainModel}) => {
  if (!data._domainModel) {
    data._domainModel = {
      [key]: _domainModel
    }
  } else {
    data._domainModel[key] = _domainModel;
  }
}

export default {
  ':slot': {},
  '@init': ({style, data}) => {
    style.height = 'auto';
  },
  '@parentUpdated'({id, data, parent, inputs, outputs}, {schema}) {
    if (schema === 'mybricks.domain-pc.crud/table') {
      if (data?.domainModel?.entity && data.columns?.length === 0) {
        const schema = getColumnsSchema(data);
        data.columns = getColumnsFromSchema(schema);
      }

      inputs.add(PaginatorInputIds.SetTotal, '设置数据总数', {type: 'number'});

      inputs.add(PaginatorInputIds.SetPageNum, '设置当前页码', {type: 'number'});
      outputs.add(PaginatorOutputIds.SetPageNumFinish, '设置页码完成', {type: 'number'});
      inputs.get(PaginatorInputIds.SetPageNum).setRels([PaginatorOutputIds.SetPageNumFinish]);

      inputs.add(PaginatorInputIds.GetPageInfo, '获取分页信息', {type: 'any'});
      outputs.add(PaginatorOutputIds.GetPageInfo, '分页数据', PageSchema);
      inputs.get(PaginatorInputIds.GetPageInfo).setRels([PaginatorOutputIds.GetPageInfo]);

      outputs.add(PaginatorOutputIds.PageChange, '点击分页', PageSchema);
    } else {
      // 不在领域模型内时，清空domain信息
      data.domainModel = {};
    }
  },
  '@inputConnected'({data, output, input, ...res}: EditorResult<Data>, fromPin, toPin) {
    if (toPin.id === InputIds.SET_DATA_SOURCE && data.columns.length === 0) {
      let tempSchema;
      if (!data.usePagination && fromPin.schema.type === 'array') {
        tempSchema = fromPin.schema;
      }
      /**
       * 分页模式下特殊处理逻辑
       * 当存在dataSource字段且为数组类型数据时，直接使用
       * 当不存在dataSource字段且仅有一个数组类型数据时，直接使用
       */
      if (data.usePagination && fromPin.schema.type === 'object') {
        if (fromPin.schema.properties?.dataSource?.type === 'array') {
          tempSchema = fromPin.schema.properties?.dataSource;
        } else {
          const dsKey = Object.keys(fromPin.schema?.properties || {});
          const arrayItemKey = dsKey.filter(
            (key) => fromPin.schema.properties?.[key]?.type === 'array'
          );
          if (arrayItemKey.length === 1) {
            tempSchema = fromPin.schema.properties?.[arrayItemKey[0]];
          }
        }
      }

      if (tempSchema) {
        data.columns = getColumnsFromSchema(tempSchema);
        input.get(InputIds.SET_DATA_SOURCE).setSchema(tempSchema);
        data[`input${InputIds.SET_DATA_SOURCE}Schema`] = tempSchema;
      }
      setDataSchema({data, output, input, ...res});
    }
  },
  '@inputDisConnected'({data, output, input, ...res}: EditorResult<Data>, fromPin, toPin) {
    if (toPin.id === InputIds.SET_DATA_SOURCE && data.columns.length === 0) {
      setDataSchema({data, output, input, ...res});
    }
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items: (props: EditorResult<Data>, ...cateAry) => {
      cateAry[0].title = '常规';
      cateAry[0].items = [
        getAddColumnEditor(props),
        ...UsePaginatorEditor,
        ...RowKeyEditor,
        ...LoadingEditor,
        ...emptyEditor
      ];

      // cateAry[1].title = '样式';
      // cateAry[1].items = [...LoadingEditor, TableStyleEditor];

      cateAry[1].title = '高级';
      cateAry[1].items = [
        ...EventEditor,
        HeaderEditor,
        ...ExpandEditor,
        rowOperationEditor,
        rowMerge,
        ...lazyLoad,
        ...filterIconDefault,
        ...ScrollToFirstRowEditor,
        ...SummaryColumn,
        ...DynamicColumnEditor,
        ...DynamicTitleEditor,
        ...getRowSelectionEditor(props)
      ];
    },
    style: [...TableStyleEditor.items, emptyStyleEditor, rowTreeEditor]
  },
  "@domainModel": {
    options: {
      type: ['list']
    },
    get({data}) {
      return data._domainModel?.dataSource;
    },
    set({input, data}, _domainModel) {
      if (!_domainModel) {
        setDomainModel({
          data,
          key: "dataSource",
          _domainModel
        })
        return;
      }
      if (isSameDomainInstanceAndService(data._domainModel?.dataSource, _domainModel)) {
        return;
      }

      if (_domainModel.defId === "_defined") {
        setDomainModel({
          data,
          key: "dataSource",
          _domainModel
        })
        return;
      }

      const schema = _domainModel.service?.response?.properties?.data || _domainModel.service?.responses?.properties?.data;
      // 类型校验
      if (schema?.type === 'array' && schema.items?.type === 'object' && schema.items.properties && _domainModel.service.method === "get") {
        setDomainModel({
          data,
          key: "dataSource",
          _domainModel
        })

        const schemaColumns = getColumnsFromSchema(schema, {
          defaultWidth: 'auto'
        });

        const columns = data.columns.filter((column) => {
          return column.contentType === "slotItem";
        }).map((column) => {
          if (column.dataIndex.endsWith(`_${column.contentType}`)) {
            return column;
          }
          return {
            ...column,
            dataIndex: column.key + `_${column.contentType}`
          }
        });

        const customIDMap: Record<string, boolean> = columns.reduce((pre, cur) => {
          pre[cur.dataIndex] = true
          return pre;
        }, {});

        data.columns = schemaColumns.filter((schemaColumn) => {
          return !customIDMap[schemaColumn.dataIndex]
        }).concat(columns);

        if (data.columns.length) {
          data.rowKey = data.columns[0].dataIndex as string;
          data.columns[0].isRowKey = true;
        }
        input.get(InputIds.SET_DATA_SOURCE).setSchema(schema);
        data[`input${InputIds.SET_DATA_SOURCE}Schema`] = schema;
      } else {
        console.warn("[数据表格] 领域模型服务类型不匹配", _domainModel);
      }
    },
  },
  // ...connectorEditor<EditorResult<Data>>({
  //   set({ data, input }: EditorResult<Data>, { schema }) {
  //     if (schema?.type === 'array' && schema.items?.type === 'object' && schema.items.properties) {
  //       data.columns = getColumnsFromSchema(schema, {
  //         defaultWidth: 'auto'
  //       });
  //       if (data.columns.length) {
  //         data.rowKey = data.columns[0].dataIndex as string;
  //         data.columns[0].isRowKey = true;
  //       }
  //       input.get(InputIds.SET_DATA_SOURCE).setSchema(schema);
  //       data[`input${InputIds.SET_DATA_SOURCE}Schema`] = schema;
  //     }
  //   }
  // }),
  ...columnEditor,
  ...PaginatorEditor,
  ...SummaryColumnEditor,
  ...rowSelectEditor,
  ...rowExpandEditor
};

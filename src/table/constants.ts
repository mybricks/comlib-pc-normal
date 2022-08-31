export const BLOCKS_KEY = 'blocks'

export const COLUMN_DATA_KEY = 'colData'

export const COLUMN_EDITORS_CLASS_KEY =
  'thead th:not(.ant-table-selection-column):not(.ant-table-cell-scrollbar):not(.ant-table-row-expand-icon-cell):not(.column-draggle)'

export const TEMPLATE_RENDER_KEY = 'record'

export const SlotIds = {
  EXPAND_CONTENT: 'expandContent'
}
export const InputIds = {
  GET_ROW_SELECTION: 'outRowSelection',
  CLEAR_ROW_SELECTION: 'clearRowSelection',
  SET_ROW_SELECTION: 'setRowSelectedKeys',
  SLOT_PROPS: 'slotProps',
  SET_DATA_SOURCE: 'dataSource',
  REFRESH: 'refresh',
  END_LOADING: 'endLoading',
  UPDATE_COLUMN_DATA: 'updateColumnData',
  SET_FILTER_INPUT: 'filterInput',
  GET_TABLE_DATA: 'tableData',
  SET_DYNAMIC_COL: 'setDynamicColumn',
  SET_DYNAMIC_TABLE_TITLE: 'setDynamicTableTitle',
  SET_EXPANDED_KEYS: 'setExpandedKeys',
  PAGINATION: 'pagination',
  SET_PAGINATION: 'setPagination'
}
export const OutputIds = {
  GET_ROW_SELECTION: 'rowSelection',
  ClickPagination: 'props',
  DRAG_FINISH: 'dragging',
  GET_TABLE_DATA: 'tableData',
  MODIFY_CELL: 'modifyCell',
  PAGINATION: 'pagination',
  SET_PAGINATION: 'setPagination'
}

export enum RowSelectionPostion {
  TOP = 'top',
  BOTTOM = 'bottom'
}

// 默认代码注释
export const defaultCodeAnnotation = `/**
* model: {
*   columns: {
*     [key: string]: {
*       dataIndex: string; 
*       visible: boolean;
*     }
*   };
*   queryParams?: Record<string, any>;
* } table数据模型
* context.callService(serviceId: number, {}) => Promise<any> 发送网络请求
*
* 例子
*  export default function (model, context) {
*   // 如果status为0则table的operator列不显示
*   if (model.queryParams && model.queryParams.status === 0) {
*     model.columns['operator'].visible = false
*   }
*  }
*/`;
// 默认代码
export const defaultCode = `
export default function (model, context) {
              
}
`;
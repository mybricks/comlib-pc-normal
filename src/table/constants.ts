export const COLUMN_EDITORS_CLASS_KEY =
  'thead th:not(.ant-table-selection-column):not(.ant-table-cell-scrollbar):not(.ant-table-row-expand-icon-cell):not(.column-draggle)';

export const TEMPLATE_RENDER_KEY = 'record';

export const SlotIds = {
  EXPAND_CONTENT: 'expandContent',

  HEADER_TITLE: 'headerTitle',
  HEADER_OPERATION: 'headerOperation',

  ROW_SELECTION_OPERATION: 'rowSelectionOperation'
};
export const InputIds = {
  // 获取勾选项
  GET_ROW_SELECTION: 'outRowSelection',
  // 清空勾选
  CLEAR_ROW_SELECTION: 'clearRowSelection',
  // 设置勾选项
  SET_ROW_SELECTION: 'setRowSelectedKeys',

  // 设置数据源
  SET_DATA_SOURCE: 'dataSource',

  // 开始loading
  START_LOADING: 'startLoading',
  // 停止loading
  END_LOADING: 'endLoading',

  // 设置筛选项
  SET_FILTER_INPUT: 'filterInput',
  // 获取表格数据
  GET_TABLE_DATA: 'getTableData',

  // 获取排序数据
  GET_SORT: 'getSorter',
  // 设置筛选数据
  SET_SORT: 'setSorter',
  // 获取筛选数据
  GET_FILTER: 'getFilter',
  // 设置筛选数据
  SET_FILTER: 'setFilter',

  /** 区块输入项 */
  // 展开行数据
  EXP_COL_VALUES: 'expColValues',
  EXP_ROW_VALUES: 'expRowValues',
  // 插槽项数据-当前列数据
  SLOT_ROW_VALUE: 'slotRowValue',
  // 插槽项数据-当前行数据
  SLOT_ROW_RECORD: 'slotRowRecord',
  // 勾选数据标识
  ROW_SELECTION_SELECTED_ROW_KEYS: 'rowSelectionSelectedRowKeys',
  // 勾选数据
  ROW_SELECTION_SELECTED_ROWS: 'rowSelectionSelectedRows',
  // 序号
  INDEX: 'index',

  // 动态设置显示列
  SET_SHOW_COLUMNS: 'showColumns',

  //动态设置显示表头
  SET_SHOW_TitleS: 'showTitles',
  // 开启关闭所有展开项
  EnableAllExpandedRows: 'enableAllExpandedRows'
};
export const OutputIds = {
  // 输出勾选项
  GET_ROW_SELECTION: 'outRowSelection',
  // 输出表格数据
  GET_TABLE_DATA: 'getTableData',
  // 输出勾选数据
  GET_FILTER: 'getFilter',
  // 输出排序数据
  GET_SORT: 'getSorter',

  // 自动输出勾选项
  ROW_SELECTION: 'rowSelection',
  // 点击筛选触发
  FILTER_CLICK: 'filterClick',
  // 筛选事件触发
  FILTER: 'filter',
  // 排序事件触发
  SORTER: 'sorter',
  // 点击行触发
  ROW_CLICK: 'rowClick',
  // 双击行触发
  ROW_DOUBLE_CLICK: 'rowDoubleClick',
  Edit_Table_Data: 'editTableData'
};

export const DefaultRowKey = '_uuid';

export const DefaultHeadStyle = { color: '#1f1f1f', background: '#f5f7f9' };
export const DefaultContentStyle = { color: '#434343' };

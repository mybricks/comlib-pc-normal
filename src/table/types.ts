import { SorterResult } from 'antd/lib/table/interface';
import { ReactElement } from 'react';

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
  showSizeChanger: boolean;
  disabled: boolean;
  showTotal: (total: number, range: [number, number]) => React.ReactNode;
}

export interface RowSelection {
  type: string;
}

export interface Scroll {
  x: number | boolean;
  y: number | string | undefined;
  scrollToFirstRowOnChange: boolean;
}

export type ContentType =
  | 'text'
  | 'color'
  | 'link'
  | 'tag'
  | 'action'
  | 'custom'
  | 'progress'
  | 'badge'
  | 'image'
  | 'slotItem'
  | 'input'
  | 'date'
  | 'switch'
  | 'group';

export interface CustomSpace {
  direction?: 'vertical' | 'horizontal';
  wrap?: boolean;
}

interface ProgressConfig {
  statusKeyName: string;
  statusEnum: Record<string, string>;
}

export interface ImageConfig {
  width?: string | number;
  height?: string | number;
  preview?: boolean;
  fallback?: string;

  useCustomSrc?: boolean;
  customSrc?: string;

  usePlaceholder?: boolean;
  placeholderSourceType?: string;
  placeholderRowKey?: string;
  placeholderHref?: string;
}
export interface IColumn {
  dataIndex: string | string[];
  title: any;
  key?: string;
  contentTemplate?: string;
  ellipsis: boolean;
  visible: boolean;
  width: string | number;
  align?: 'left' | 'center' | 'right' | undefined;
  isAction?: boolean;
  render?: () => any;
  hasTip?: boolean;
  tip?: string;
  isMapping?: boolean;
  mappingEnum?: any;
  contentType: ContentType;
  colorEnum?: any;
  sorter?: Sorter;
  filter?: Filter;
  actionBtns?: any[];
  useTooltip?: boolean;
  columnDirection?: 'vertical' | 'horizontal';
  customSpace?: CustomSpace;
  progressConfig?: ProgressConfig;
  ellipsisActionBtnsConfig?: {
    useEllipsis?: boolean;
    maxToEllipsis: number;
    trigger?: ('click' | 'hover' | 'contextMenu')[];
  };
  ellipsisTagConfig?: {
    useEllipsis?: boolean;
    maxToEllipsis?: number;
    onlyShowOver?: boolean;
    trigger?: 'click' | 'hover' | 'contextMenu';
  };
  linkConfig?: {
    type?: string;
    href?: string;
    rowKey?: string;
    routeType?: string;
  };
  tagEnum?: any;
  fns?: any;

  imageConfig?: ImageConfig;
  supportCopy?: boolean;
  supportEdit?: boolean;
  slotId?: string;
  slotConfig?: {
    outputId?: string;
  };
  keepWordWrap?: boolean;
  inputConfig?: {
    placeholder?: string;
  };
  dateConfig?: {
    formatter?: string;
    customFomatter?: boolean;
  };
  switchConfig?: {
    id: string;
    size?: 'default' | 'small';
    checkedScript?: string;
    checkedChildren?: ReactElement;
    unCheckedChildren?: ReactElement;
  };
  fixed?: string;

  customRenderCode?: string;
  className?: string;
  tooltipKey?: string;

  children?: IColumn[];
}

export type SorterType = 'length' | 'size' | 'request' | 'date';
export interface Sorter {
  enable: boolean;
  type: SorterType;
}

export interface Filter {
  enable?: boolean;
  type?: 'local' | 'request';
  options?: any[];
  filterSource?: 'local' | 'remote';
  filterType?: 'multi' | 'single';
}

export interface SubmitAction {
  id: string;
  title: string;
}

export interface Data {
  timestamp: number;
  rowKey: string;
  dataSource: any[];
  columns: IColumn[];
  extraColumns?: (IColumn & { index?: number })[];
  bordered: boolean;
  size: 'default' | 'middle' | 'small';
  total: number;
  hasPagination: boolean;
  pagination: Pagination;
  useRowSelection: boolean;
  selectionType: string;
  rowSelection: RowSelection;
  fixedHeader: boolean;
  scroll: Scroll;
  queryParams: Record<string, any>;
  useLoading: boolean;
  immediate: boolean;
  pageNumber: string;
  pageSize: string;
  scratchOutputIds: string[];
  expandable: boolean;
  expandableBlocks: any;
  batchBtns: any[];
  loadingTip?: string;
  useInput?: boolean;
  onLoadData?: string;
  actionBtns: any[];
  tableTitle?: string;
  tableTitleStyle?: any;
  // tableTitleContainerStyle?: any;
  useActionBtns?: boolean;
  useTableTitle?: boolean;
  useTableTitleWithCount?: boolean;
  rowSelectionPostion?: string[];
  showPaginationTotal?: boolean;
  rowSelectionLimit?: number;
  isActive?: boolean;
  onRow?: (record: any, idx: number) => any;
  columnDataUpdateConfig?: {
    use?: boolean;
    rowKey?: string;
  };
  sortParams?: SorterResult<any>;
  filterParams: Record<string, string[] | null>;
  draggable?: boolean;
  unAutoSelect?: boolean;
  selectComNameSpace?: string;
  isDisabledScript?: string;
  useHeaderSlot?: boolean;
  headerSlotId?: string;
  // 是否显示表头
  showHeader?: boolean;

  useExpand?: boolean;

  useSetSelectedRowKeys?: boolean;

  useSlotProps?: boolean;
  jumpToFirstPageWhenRefresh?: boolean;

  // 刷新时覆盖历史筛选数据
  cleanQueryParamsWhenRefresh?: boolean;
  // 动态设置显示列
  useDynamicColumn?: boolean;
  // 动态设置表格标题
  useDynamicTableTitle?: boolean;
  // 提交行为
  submitActions?: SubmitAction[];
  //兼容拖拽item数据
  useDrapItem: boolean;

  //显示表格列筛选
  useColumnSetting?: boolean;

  // 标识表格当前正在编辑的单元格
  isEditing?: string;

  // 逻辑连线不再触发列配置弹窗
  noMatchSchema?: boolean;

  // 输出表格数据
  outputTableData?: boolean;
}

export interface ResponseData {
  total?: number;
  dataSource?: any[];
  extraColumns?: IColumn[];
  queryParams?: any;
}

export enum Location {
  FRONT = 'front',
  BACK = 'back',
}

export enum MappingEnumOption {
  NOT_EXIST = '_fz_undefined_',
  EMPTY_STRING = '_fz_empty_string_'
}
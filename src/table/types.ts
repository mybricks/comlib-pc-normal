import { SorterResult } from "antd/lib/table/interface";

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

export type ContentType = 'text' | 'color' | 'link' | 'tag' | 'action' | 'custom' | 'progress' | 'badge' | 'image' | 'slotItem' | 'input'

export interface CustomSpace  {
  direction?: 'vertical' | 'horizontal'
  wrap?: boolean
}

interface ProgressConfig {
  statusKeyName: string
  statusEnum: Record<string, string>
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
  sorter?: Sorter
  filter?: Filter
  actionBtns?: any[]
  useTooltip?: boolean
  columnDirection?: 'vertical' | 'horizontal'
  customSpace?: CustomSpace
  progressConfig?: ProgressConfig
  ellipsisActionBtnsConfig?: {
    useEllipsis?: boolean;
    maxToEllipsis: number;
    trigger?: ('click' | 'hover' | 'contextMenu')[]
  };
  ellipsisTagConfig?: {
    useEllipsis?: boolean;
    maxToEllipsis?: number;
    onlyShowOver?: boolean;
    trigger?: ('click' | 'hover' | 'contextMenu')
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
  supportCopy?: boolean
  slotId?: string
  slotConfig?: {
    outputId?: string
  }
  keepWordWrap?: boolean
  inputConfig?: {
    placeholder?: string
  }
  fixed?: string;

  customRenderCode?: string;
  className?: string;
}

export type SorterType = 'length' | 'size' | 'request' | 'date'
export interface Sorter {
  enable: boolean
  type: SorterType
}

export interface Filter {
  enable?: boolean
  type?: 'local' | 'request',
  options?: any[]
  filterSource?: 'local' | 'remote'
  filterType?: 'multi' | 'single'
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
  scratchOutputIds: string[]
  expandable: boolean
  expandableBlocks: any
  batchBtns: any[]
  loadingTip?: string
  useInput?: boolean
  onLoadData?: string
  actionBtns: any[]
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
  filterParams: Record<string, string[] | null>
  draggable?: boolean
  unAutoSelect?: boolean
  selectComNameSpace?: string;
  isDisabledScript?: string;
  useHeaderSlot?: boolean;
  headerSlotId?: string;
  // 是否显示表头
  showHeader?: boolean;

  useExpand?: boolean;

  useSetSelectedRowKeys?: boolean;

  useSlotProps?: boolean;
}

export interface ResponseData {
  total?: number
  dataSource?: any[]
  extraColumns?: IColumn[]
}

export enum Location {
  FRONT = "front",
  BACK = "back"
}
import { TformattersValue } from 'src/utils/dataFormatter/types';
import { Data as PaginationData } from './components/Paginator/constants';

export enum ContentTypeEnum {
  Text = 'text',
  SlotItem = 'slotItem',
  Group = 'group'
}
export enum AlignEnum {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}
export enum FixedEnum {
  Left = 'left',
  Right = 'right',
  Default = ''
}
export enum SorterTypeEnum {
  Length = 'length',
  Size = 'size',
  Date = 'date',
  Request = 'request'
}
interface Sorter {
  enable: boolean;
  type: SorterTypeEnum;
}
export enum FilterTypeEnum {
  Local = 'local',
  Request = 'request',

  Multiple = 'multiple',
  Single = 'single'
}

export type FilterIconEnum = string;

export interface Filter {
  enable?: boolean;
  type?: FilterTypeEnum;
  options?: any[];
  hideFilterDropdown?: boolean;
  filterSource?: FilterTypeEnum;
  filterType?: FilterTypeEnum;
  /** 筛选图标继承自表格 */
  filterIconInherit?: boolean;
  /** 筛选图标 */
  filterIcon?: FilterIconEnum;
}
export enum WidthTypeEnum {
  Auto = 'auto'
}

export interface IColumn {
  key: string;
  dataIndex: string | string[];
  title: string;
  contentType: ContentTypeEnum;

  visible?: boolean;
  width?: number | WidthTypeEnum;
  align?: AlignEnum;
  /** 内容字体颜色 */
  contentColor?: string;
  /** 表头背景色 */
  titleBgColor?: string;
  /** 表头字体色 */
  titleColor?: string;
  headStyle: any;
  contentStyle: any;
  hasTip?: boolean;
  tip?: string;
  // 省略展示
  ellipsis: any;

  sorter?: Sorter;
  filter?: Filter;

  slotId?: string;

  fixed?: FixedEnum;

  children?: IColumn[];
  className?: string;

  keepDataIndex?: boolean;
  dataSchema?: any;

  formatData?: TformattersValue;
  colMergeScirpt?: string;

  // 带排序列表头对齐方式
  sorterAlign?: AlignEnum;
}

export enum SizeEnum {
  Default = 'default',
  Middle = 'middle',
  Small = 'small'
}
interface Scroll {
  x: number | boolean;
  y: number | string | undefined;
  scrollToFirstRowOnChange: boolean;
}
export enum RowSelectionPostionEnum {
  TOP = 'top',
  BOTTOM = 'bottom'
}
export enum RowSelectionTypeEnum {
  Radio = 'radio',
  Checkbox = 'checkbox'
}
export enum TableLayoutEnum {
  FixedWidth = 'fixedWidth',
  Fixed = 'fixed',
  Auto = 'auto'
}
export interface Data {
  // 数据源唯一标识
  rowKey?: string;
  // 数据源
  dataSource: any[];

  // 列配置
  columns: IColumn[];
  // 是否显示表头
  showHeader?: boolean;
  //显示表格列筛选
  useColumnSetting?: boolean;

  // 列宽分配规则
  tableLayout?: TableLayoutEnum;

  // 边框
  bordered: boolean;
  // 尺寸
  size: SizeEnum;
  // 固定表头
  fixedHeader: boolean;
  enableStripe: boolean;
  // 滚动
  scroll: Scroll;

  // 开启loading
  useLoading: boolean;
  // loading文案
  loadingTip?: string;

  // 使用勾选
  useRowSelection: boolean;
  // 点击行触发勾选
  enableRowClickSelection: boolean;
  // 勾选类型
  selectionType: RowSelectionTypeEnum;
  // 勾选操作区位置
  rowSelectionPostion?: RowSelectionPostionEnum[];
  // 勾选限制
  rowSelectionLimit?: number;
  // 是否禁止勾选
  isDisabledScript?: string;
  // 使用动态设置勾选项
  useSetSelectedRowKeys?: boolean;

  // 排序参数
  sortParams?: {
    id?: string;
    order?: string;
  };
  // 筛选参数
  filterParams: Record<string, string[] | null>;

  // 头部 标题区插槽
  useHeaderTitleSlot?: boolean;
  // 头部 操作区插槽
  useHeaderOperationSlot?: boolean;

  // 使用列展开
  useExpand?: boolean;
  expandDataIndex?: string | string[];
  expandDataSchema?: any;

  usePagination?: boolean;
  paginationConfig: PaginationData;

  // 动态设置显示列
  useDynamicColumn?: boolean;

  //动态设置显示表格标题和字段
  useDynamicTitle?: boolean;

  titleBgColor: string;
  headStyle: any;
  contentStyle;
  enableRowClick?: boolean;
  enableRowDoubleClick?: boolean;
  enableCellClick?: boolean;
  enableCellFocus?: boolean;
  enableRowFocus: boolean;
  focusRowStyle: any;
  domainModel: {
    entity?: any;
  };
  // 是否默认展开所有行
  defaultExpandAllRows: boolean;

  useSummaryColumn: boolean; // 是否开启总结栏
  summaryColumnTitle: string; // 总结栏 title
  summaryCellTitleCol: number; // 总结栏 title col
  summaryColumnContentType: 'text' | 'slotItem'; // 总结栏内容类型
  summaryColumnContentSchema: object; // 总结栏内容Schema
  enbaleRowMerge?: boolean;
  enableOnRow?: boolean;
  rowMergeConfig?: {
    // 合并规则，当连续的几行中，该列的值一样时，合并符合要求的行
    mergeByField: string;
    // 返回true，表示对应的列不能合并
    excludeFields?: string[];
  };
  fixedHeight?: string | number;

  mergeCheckboxColumn?: boolean; // 合并勾选栏

  //是否自定义空状态
  isEmpty: boolean;
  //自定义描述内容
  description: string;
  //是否自定义图片
  //isImage: boolean;
  //图片地址
  image: string;
  onRowScript: string;
  enableDynamicChangeCols: boolean; // 动态修改列属性

  /** 表格数据懒加载 */
  lazyLoad: boolean; 
  /** 表格筛选默认图标 */
  filterIconDefault?: FilterIconEnum
}

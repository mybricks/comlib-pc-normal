import { DropDownProps } from "antd";

export interface ActionBtn {
  id: any,
  title: string,
  size: 'small' | 'middle' | 'large' | any
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | any,
  danger?: boolean,
  showText?: boolean,
  hidden?: boolean,
  iconConfig: {
    src: IconSrcType,
    size: [number, number],
    gutter: number,
    innerIcon?: string,
    customIcon?: string,
  }
  displayScript?: string;
}
export interface ActionBtnsProps {
  record: Record<string, any>;
  outputItem: Record<string, any>;
  data: Data;
  env: any;
  outputs: any;
  onError: any;
}

export const MODIFY_BTN_ID = 'modify';
export const DELETE_BTN_ID = 'delete';

export type IconSrcType = false | 'custom' | 'inner';
export interface IconType {
  title: string,
  src: IconSrcType,
  size: [number, number],
  gutter: [number],
  displayRule: 'default' | 'dynamic',
  innerIcon?: string,
  customIcon?: string,
  displayExpression?: string
}

export interface Data {
  jsonData: string;
  isEditing: string;
  isAdding: string;
  /**
   * @deprecated 于版本 1.0.32 被弃用
   */
  defaultExpandAll?: boolean;
  openDepth: number;
  treeData: TreeData[];
  checkable: boolean | 'custom';
  checkedKeys: any[];
  disableCheckbox: boolean;
  showLine: boolean;
  expandedKeys: any[];
  outParentKeys?: boolean;
  showError: boolean;
  // 搜索值
  searchValue: string;
  // 过滤值
  filterValue: string;
  // 过滤字段
  filterNames: string[];
  clickExpandable: boolean;
  addable: boolean;
  addTips: string[];
  maxDepth: number;
  useActions: boolean;
  actionBtns: ActionBtn[];
  allNodeDeletable: boolean;
  /** 字段配置 */
  keyFieldName: string;
  titleFieldName: string;
  childrenFieldName: string;
  useCheckEvent?: boolean;
  checkStrictly?: boolean;
  /** 省略样式配置 */
  ellipsisActionBtnsConfig: {
    useEllipsis: boolean;
    maxToEllipsis: number;
  } & DropDownProps;
  /** 节点icon配置 */
  icons: IconType[];
  /**
   * @deprecated 于版本 1.0.18 被弃用
   */
  iconConfig: {
    defaultSrc: IconSrcType;
    size: [number, number];
    gutter: number;
    innerIcon?: string;
    customIcon?: string;
  }
  removeConfirm: string;
  editInline?: boolean;
  /** @description 1.0.45 动态禁用表达式 */
  disabledScript?: string;
  /** 动态可勾选表达式 */
  checkableScript?: string;
  /** 拖拽 */
  draggable: boolean | 'custom';
  /** 动态可拖拽表达式 */
  draggableScript?: string;
  /** 允许放置 */
  allowDrop: boolean | 'custom';
  /** 动态可放置表达式 */
  allowDropScript?: string;
  /** 放置范围限制 */
  useDropScope: boolean | 'parent';
  /** 放置范围限制提示语 */
  dropScopeMessage?: string;
  /** 输出数据类型 */
  valueType: string;
  /** 标题省略配置 */
  titleEllipsis: boolean;
  /** 操作项显示方式 */
  actionsShowWay: 'default' | 'hover';
  /** 是否显示图片 */
  description: string;
  /** 是否显示图片 */
  isImage: boolean;
  /** 图片地址 */
  image: string;
  /** 可滚动高度 */
  scrollHeight: string;
  /**
   * @description 组件版本: 1.0.40
   */
  useStaticData: boolean;
  /**
   * @description 组件版本: 1.0.40
   */
  staticData: string;
  /**
   * @description 组件版本: 1.0.48 树是否使用紧凑模式
   */
  useCompactTheme?: boolean;
}

export interface TreeData {
  title: string;
  key: string;
  disableCheckbox?: boolean;
  children?: TreeData[];
  [key: string]: any;
}

export const ValueType = {
  KEY_FIELD: 'keyField',
  TREE_NODE: 'treeNode'
}
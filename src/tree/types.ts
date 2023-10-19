import { DropDownProps } from "antd";

export interface ActionBtn {
  id: any,
  title: string,
  size: 'small' | 'middle' | 'large' | any
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | any
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
  defaultExpandAll: boolean;
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
  /** 标题 */
  titleEllipsis: boolean;
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
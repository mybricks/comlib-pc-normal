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
}

export interface TreeData {
  title: string;
  value: string;
  key: string;
  _key?: string;
  disableCheckbox?: boolean;
  children?: TreeData[];
  [key: string]: any;
}

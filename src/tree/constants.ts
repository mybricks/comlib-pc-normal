import { DropDownProps } from "antd";

export interface ActionBtn {
  id: any,
  title: string,
  size: 'small' | 'middle' | 'large' | any
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | any
  showText?: boolean,
  hidden?: boolean,
}
export interface ActionBtnsProps {
  record: Record<string, any>;
  outputItem: Record<string, any>;
  data: Data;
  env: any;
  outputs: any;
}

export const MODIFY_BTN_ID = 'modify';
export const DELETE_BTN_ID = 'delete';
export interface Data {
  jsonData: string;
  isEditing: string;
  isAdding: string;
  defaultExpandAll: boolean;
  treeData: TreeData[];
  checkable: boolean;
  checkedKeys: any[];
  disableCheckbox: boolean;
  expandedKeys: any[];
  outParentKeys?: boolean;
  showError: boolean;
  searchValue: string;
  clickExpandable: boolean;
  addable: boolean;
  addTips: string[];
  maxDepth: number;
  useActions: boolean;
  actionBtns: ActionBtn[];
  allNodeDeletable: boolean;
  keyFieldName: string;
  useCheckEvent?: boolean;
  checkStrictly?: boolean;
  ellipsisActionBtnsConfig: {
    useEllipsis: boolean;
    maxToEllipsis: number;
  } & DropDownProps;
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

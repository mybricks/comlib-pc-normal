import { CSSProperties } from 'react';

export type TYPES =
  | 'key'
  | 'number'
  | 'bracket'
  | 'string'
  | 'object'
  | 'boolean'
  | 'null'
  | 'undefined'
  | 'function';
export const SINGLE_INDENT = 5;
export interface Props {
  obj: object;
  rand: number;
  indentWidth: number;
}
/**
 * 数据源
 * @param dataSource 数据源
 * @param json json数据
 * @param indentWidth 缩进距离  --未实现
 * @param colors 不同类型对应的颜色
 * @param collapsed 默认展开深度
 * @param collapseStringsAfterLength 属性值最大长度
 * @param displayObjectSize 是否展示条目
 * @param enableClipboard 节点复制
 * @param enableOutput 节点输出
 * @param useSlotProps 使用插槽数据
 */
export interface Data {
  dataSource: 1 | 2;
  json: any;
  indentWidth: number;
  colors: {
    [K in TYPES]: string;
  };
  collapsed: number;
  collapseStringsAfterLength: number;
  displayObjectSize: boolean;
  enableClipboard: boolean;
  enableOutput: boolean;
  style?: CSSProperties;
  useSlotProps?: boolean;
}

export const InputIds = {
  SetJsonData: 'jsonData',
  SlotProps: 'slotProps'
};
export const OutputIds = {
  Select: 'nodeData'
};

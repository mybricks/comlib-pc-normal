// export interface SlotConfig {
//   outputId?: string;
// }

import React from "react";

/** 类型 */
export enum TypeEnum {
  /** 文本 */
  Text = 'text',
  /** 全局自定义插槽 */
  AllSlot = 'slotItem',
  /** 局部自定义插槽 */
  PartSlot = 'slotItemWithLabel'
}

export interface Item {
  id: string;
  label: string;
  key: string;
  value: any;
  span: number; //范围是 1 到该行剩余column数
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  stylePadding?: [number, number];
  type?: TypeEnum;
  direction?: 'horizontal' | 'vertical';
  isHiddenScript?: string;
  color?: any;
  itemType?: string;
  // slotConfig?: SlotConfig;
  slotId?: string;
  rows?: number;
  maxWidth?: React.CSSProperties['maxWidth'];
  ellipsis?: boolean;
  padding?: number[];
  showLabel: boolean;
  useSuffix?: boolean;
  suffixBtnText?: string;
  itemStyle?: any;
  isHidden?: boolean;
  labelDesc?: string

  //每一项的schema
  schema?: any;

  visible?: boolean | undefined
}

/** 数据来源 */
export enum DataSourceEnum {
  /** 手动搭建 */
  Default = 1,
  /** 外部输入 */
  External = 2
}
/** 大小 */
export enum SizeEnum {
  /** 默认 */
  Default = 'default',
  /** 中等 */
  Middle = 'middle',
  /** 小号 */
  Small = 'small'
}
export enum LayoutEnum {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}
/**
 * 数据源
 */
export interface Data {
  dataSource: DataSourceEnum;
  title: string;
  showTitle: boolean;
  dynamicTitle: boolean;
  size: SizeEnum;
  layout: LayoutEnum;
  column: number;
  mobileColumn: number;
  bordered: boolean;
  colon: boolean;
  items: Item[];
  useSlotProps?: boolean;
  rawData: any;
  inputSchema: any;
  autoWidth?: boolean;
  globalLabelStyle: React.CSSProperties;
  showExtra: boolean; // 右上角操作区域
}

export const InputIds = {
  SetDataSource: 'setDataSource',
  SetTitle: 'setTitle',
  CurDs: 'curDs',
  DataSource: 'dataSource',
  SetDataDesc: 'setDataDesc'
};

export const ScopeSlotIds = {
  Content: 'content',
  UpperRightArea: 'upperRightArea'
}
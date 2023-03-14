// export interface SlotConfig {
//   outputId?: string;
// }
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
  labelStyle?: Record<string, string | number>;
  contentStyle?: Record<string, string | number>;
  stylePadding?: [number, number];
  type?: TypeEnum;
  direction?: 'horizontal' | 'vertical';
  isHiddenScript?: string;
  color?: any;
  itemType?: string;
  // slotConfig?: SlotConfig;
  slotId?: string;
  lineLimit?: number;
  widthLimit?: number;
  limit?: boolean;
  padding?: number[];
  showLable: boolean;
  useSuffix?: boolean;
  suffixBtnText?: string;
  itemStyle?: any;
  isHidden?: boolean;
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
  bordered: boolean;
  colon: boolean;
  items: Item[];
  useSlotProps?: boolean;
  rawData: any;
  inputSchema: any;
  globalLabelStyle: React.CSSProperties
}

export const InputIds = {
  SetDataSource: 'setDataSource',
  SetTitle: 'setTitle',
  CurDs: 'curDs',
  DataSource: 'dataSource'
};

export const ScopeSlotIds = {
  Content: 'content'
}
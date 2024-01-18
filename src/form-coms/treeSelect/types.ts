import { TreeSelectProps } from 'antd'
export interface Option {
  value: any,
  label: string,
  children: Option[];
  disabled?: boolean
  disableCheckbox?: boolean
  selectable?: boolean;
  checkable?: boolean;
}
export interface Data {
  config: TreeSelectProps;
  maxTagCountType: 'isResponsive' | 'isCustom';
  options: Option[];
  rules: any[];
  value?: number | string | number[] | string[];
  useLoadData?: boolean
  labelFieldName?: string
  valueFieldName?: string
  childrenFieldName?: string
  loadDataOnce?: boolean,
  icons: IconType[],
  // 默认展开深度
  openDepth: number,
  // 展开图标配置
  switcherIcon: IconType,
  isEditable: boolean
  /** @description 1.2.13 是否使用搜索事件 */
  customOnSearch: boolean;
}

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
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
}
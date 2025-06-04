import { PickerProps } from 'antd-mobile';
import { Option } from '../types';

export interface Data {
  config: {
    options: any[];
    disabled: boolean;
    placeholder: string;
    loading?: boolean;
    labelInValue?: boolean;
    showSearch: boolean;
    filterOption: boolean;
    optionFilterProp: string;
  } & PickerProps;
  rules: any[];
  value?: any[];
  staticOptions: Option[];
  remoteOptions: any[];
  dropdownSearchOption: boolean;
  outputValueType: any[];
  validateTrigger: string[];
  isEditable: boolean;
  resetOptionsWhenEmptySearch: boolean;
  labelFieldName: string;
  valueFieldName: string;
  disabledFieldName: string;
  checkedFieldName: string;
  customField: boolean;
  /** 挂载点 */
  mount?: string
}
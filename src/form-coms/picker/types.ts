import { PickerProps } from 'antd-mobile';
import { Option } from '../types';
import { PickerValue } from 'antd-mobile/es/components/picker-view';

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
  value?: PickerValue[];
  staticOptions: Option[];
  remoteOptions: any[];
  dropdownSearchOption: boolean;
  outputValueType: PickerValue[];
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
import { SelectProps } from 'antd';
import { Option } from '../types';

export interface Data {
  config: {
    options: any[];
    disabled: boolean;
    allowClear: boolean;
    placeholder: string;
    loading?: boolean;
    mode?: 'tags' | 'multiple' | 'default';
    labelInValue?: boolean;
    showSearch: boolean;
    filterOption: boolean;
    optionFilterProp: string;
    
  } & SelectProps;
  /** 搭建态resize的宽度，用于设置下拉框宽度 */
  editResizeWidth?: number
  maxHeight: string;
  maxTagCount: number | 'responsive';
  rules: any[];
  value?: number | string | number[] | string[];
  staticOptions: Option[];
  remoteOptions: any[];
  dropdownSearchOption: boolean;
  outputValueType: 'value' | 'labelInValue' | 'option';
  validateTrigger: string[];
  isEditable: boolean;
  resetOptionsWhenEmptySearch: boolean;
  /**@description v1.1.17 选项后置插槽 */
  slotAfterOption?: string;
  /**@description v1.1.17 搭建态是否展示弹层 */
  hidePopWhenEdit?: boolean;
}
import { RadioGroupProps } from 'antd';
import { Option } from '../types';

export interface Data {
  config: RadioGroupProps;
  rules: any[];
  value: number | string | undefined;
  staticOptions: Option[];
  enableButtonStyle: boolean;
  buttonStyle: 'outline' | 'solid';
  layout: 'vertical' | 'horizontal';
  isEditable: boolean;
  autoFocus: false | 'first' | 'defaultCheck';
}

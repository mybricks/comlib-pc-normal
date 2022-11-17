import { Option } from '../types';
import { TreeSelectProps } from 'antd'

export interface Data {
    config: TreeSelectProps;
    maxTagCountType: 'isResponsive' | 'isCustom';
    options: Option[];
    rules: any[];
    value?: number | string | number[] | string[];
}
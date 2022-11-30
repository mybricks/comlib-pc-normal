import { Option } from '../types';

export interface Data {
    config: {
        options: any[];
        disabled: boolean;
        allowClear: boolean;
        placeholder: string;
        loading?: boolean;
        mode?: 'tags' | 'multiple';
        labelInValue?: boolean;
        showSearch: boolean;
        filterOption: boolean;
        optionFilterProp: string;
    };
    rules: any[];
    value?: number | string | number[] | string[];
    staticOptions: Option[];
    remoteOptions: any[];
    dropdownSearchOption: boolean;
}
import { Option } from '../types';

export interface Data {
    config: {
        disabled: boolean;
        defaultValue: any;
    };
    visible: boolean;
    rules: any[];
    value: number | string | undefined;
    options: any[];
    staticOptions: Option[];
}

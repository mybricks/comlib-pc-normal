import { Option } from '../types';

export interface Data {
    config: {
        options: any[];
        disabled: boolean;
        defaultValue: any;
    };
    visible: boolean;
    rules: any[];
    value: number | string | undefined;
    staticOptions: Option[];
}

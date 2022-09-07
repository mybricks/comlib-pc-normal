import { Option } from '../types';

export interface Data {
    config: {
        disabled: boolean;
    };
    visible: boolean;
    rules: any[];
    value: number | string | undefined;
    options: any[];
    staticOptions: Option[];
}

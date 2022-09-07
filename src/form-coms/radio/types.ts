import { Option } from '../types';

export interface Data {
    config: {
        disabled: boolean;
        options: any[];
    };
    visible: boolean;
    rules: any[];
    value: number | string | undefined;
    staticOptions: Option[];
}

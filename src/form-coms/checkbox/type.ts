export interface Option {
    label: string;
    value: string;
    children?: Option[];
    key: string | number;
    disabled?: boolean;
    checked: boolean;
}

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

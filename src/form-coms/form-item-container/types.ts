export interface Data {
    value: string | undefined;
    rules: any[];
    disabled: boolean;
    childrenInputs: Record<string, any>;
    config: {};
    valueSchema: object;
}
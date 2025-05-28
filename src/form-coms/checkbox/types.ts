import { CheckboxOptionType } from 'antd';

export interface Data {
    config: {
        options: CheckboxOptionType[];
        disabled: boolean;
    };
    showLabelExpand?: boolean;
    showExpand?: boolean;
    showExpandLimit: number;
    rules: any[];
    value?: any[];
    checkAll: boolean;
    checkAllText: string;
    staticOptions: CheckboxOptionType[];
    options: any[];
    renderError?: boolean;
    layout: 'vertical' | 'horizontal';
    isEditable: boolean;
    isIndeterminate: boolean;
    defaultCheckedAll?: boolean;
    eventBubble?: boolean;
    outputValueType: 'value' | 'option'
}

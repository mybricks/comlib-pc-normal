import type { SliderBaseProps, SliderSingleProps, SliderRangeProps } from 'antd/es/slider';

export interface Data {
    config: SliderSingleProps | SliderRangeProps;
    visible: boolean;
    rules: any[];
    value?: number | [number, number];
    singleValue?: number;
    rangeValue?: [number, number];
    useInput?: boolean;
    formatter?: string;
    sliderSpan?: number;
    inputSpan?: number;
}

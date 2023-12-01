import type { SliderSingleProps, SliderRangeProps } from 'antd/es/slider';

export type SliderProps = SliderSingleProps | SliderRangeProps;

export interface Data {
    config: SliderProps;
    rules: any[];
    //value?: number | [number, number];
    //singleValue?: number;
    //rangeValue?: [number, number];
    useInput?: boolean;
    formatter?: string;
    sliderSpan?: number;
    inputSpan?: number;
}

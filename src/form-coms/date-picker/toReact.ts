import { DatePickerProps } from 'antd';
import { getPropsFromObject } from '../../utils/toReact';
import { Data } from './runtime';

export default function ({ data, slots }: RuntimeParams<Data>) {
    const getShowTime = () => {
        if (!data.showTime || typeof data.showTime === 'boolean') {
            return data.showTime;
        }
        return typeof data.showTime?.defaultValue === 'string'
            ? () => `{
                defaultValue: moment('${data.showTime.defaultValue}', 'HH:mm:ss')
            }`
            : true;
    };
    const datePickerWrapProps = {
        style: {}
    };

    const defaultDatePickerProps = {
        showTime: false,
        disabled: false,
        picker: 'date'
    };
    const datePickerProps: DatePickerProps = {
        // value,
        showTime: getShowTime(),
        ...data.config,
        style: {
            width: '100%'
        },
        // onChange,
    };

    const str = `<div ${getPropsFromObject(datePickerWrapProps)}>
                   <DatePicker
                    ${getPropsFromObject(datePickerProps, defaultDatePickerProps)}
                   />
                 </div>`

    return {
        imports: [
            {
                from: 'antd',
                coms: ['DatePicker']
            },
            {
                from: 'moment',
                default: 'moment'
            },
            {
                from: 'antd/dist/antd.css',
                coms: []
            }
        ],
        jsx: str,
        style: '',
        js: ''
    }
}
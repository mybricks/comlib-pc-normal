import moment from 'moment';
import { DatePickerProps } from 'antd';
import { getPropsFromObject } from '../../utils/toReact';
import { Data } from './runtime';

export default function ({ data, slots }: RuntimeParams<Data>) {
    const getShowTime = () => {
        if (!data.showTime || typeof data.showTime === 'boolean') {
            return data.showTime;
        }
        return typeof data.showTime?.defaultValue === 'string'
            ? {
                defaultValue:
                    moment(data.showTime.defaultValue, 'HH:mm:ss')
            }
            : true;
    };
    const datePickerCls = {
        style: {}
    };
    const selectCfg: DatePickerProps = {
        // value,
        showTime: getShowTime(),
        ...data.config,
        style: {
            width: '100%'
        },
        // onChange,
    };

    const str = `<div ${getPropsFromObject(datePickerCls)}>
                   <DatePicker
                    ${getPropsFromObject(selectCfg)}
                   />
                 </div>`

    return {
        imports: [
            {
                form: 'antd',
                coms: ['DatePicker']
            },
            {
                form: 'antd/dist/antd.css',
                coms: []
            }
        ],
        jsx: str,
        style: '',
        js: ''
    }
}
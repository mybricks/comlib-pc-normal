import moment from 'moment';
import { DatePickerProps } from 'antd';
import { getObjectDistrbuteStr, getObjectStr } from '../../utils/toReact';
import { Data } from './runtime';

export default function ({ data, slots }: RuntimeParams<Data>) {
    const getShowTime = () => {
        if (!data.showTime || typeof data.showTime === 'boolean') {
            return data.showTime;
        }
        return {
            defaultValue:
                typeof data.showTime?.defaultValue === 'string'
                    ? moment(data.showTime.defaultValue, 'HH:mm:ss')
                    : undefined
        };
    };
    const datePickerCls = {
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

    const str = `<div style={${getObjectStr(datePickerCls)}}>
                   <DatePicker
                    ${getObjectDistrbuteStr(selectCfg)}
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
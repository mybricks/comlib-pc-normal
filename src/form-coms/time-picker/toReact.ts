import { TimePickerProps } from 'antd';
import { getPropsFromObject, getObjectStr } from '../../utils/toReact';
import { Data } from './types';

export default function ({ data, slots }: RuntimeParams<Data>) {
    const TimePickerCls = {
    };
    const TimePickerCfg: TimePickerProps = {
        placeholder: data.placeholder,
        disabled: data.disabled,
        allowClear: true
        //value: value,
        // onChange,
        // onBlur,
        // onSearch,
        // notFoundContent
    };

    const str = `<TimePicker
                  ${getPropsFromObject(TimePickerCfg)}
                  style={{ width: '100%' }}
                  />`               

    return {
        imports: [
            {
                from: 'antd',
                coms: ['TimePicker']
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
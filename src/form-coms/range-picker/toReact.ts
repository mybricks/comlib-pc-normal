import moment from 'moment';
import { getPropsFromObject, getObjectStr } from '../../utils/toReact';
import { Data } from './runtime';

export default function ({ data, slots }: RuntimeParams<Data>) {
  const getShowTime = () => {
    if (!data.showTime || typeof data.showTime === 'boolean') {
      return data.showTime;
    }
    return {
      defaultValue: Array.isArray(data.showTime?.defaultValue)
        ? data.showTime?.defaultValue.map((item) => moment(item, 'HH:mm:ss'))
        : undefined
    };
  };
    const datePickerCls = {
    };
    const datePickerCfg = {
        // value,
        showTime: getShowTime(),
        ...data.config,
        style: {
            width: '100%'
        },
        // onChange,
    };

    const str = `<div style={${getObjectStr(datePickerCls)}}>
                   <DatePicker.RangePicker
                   ${getPropsFromObject(datePickerCfg)}
                   />
                 </div>`

    return {
        imports: [
            {
                from: 'antd',
                coms: ['DatePicker']
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
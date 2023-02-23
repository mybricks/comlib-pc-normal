import moment from 'moment';
import { getPropsFromObject, getObjectStr } from '../../utils/toReact';
import { Data } from './runtime';

export default function ({ data, slots }: RuntimeParams<Data>) {
  const getShowTime = () => {
    if (!data.showTime || typeof data.showTime === 'boolean') {
      return data.showTime;
    }
    return  Array.isArray(data.showTime?.defaultValue)
        ? ()=> `{
          defaultValue: [ moment('${data.showTime.defaultValue[0]}', 'HH:mm:ss'), moment('${data.showTime.defaultValue[1]}', 'HH:mm:ss')]
        }`
        : true
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

    const str = `<DatePicker.RangePicker ${getPropsFromObject(datePickerCfg)} />`               

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
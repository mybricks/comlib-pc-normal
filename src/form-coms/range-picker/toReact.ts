import { getPropsFromObject, getObjectStr } from '../../utils/toReact';
import { Data } from './runtime';

export default function ({ data, slots }: RuntimeParams<Data>) {
  const defaultDeps: { from: string, default: string }[] = [];

  const getShowTime = () => {
    if (!data.showTime || typeof data.showTime === 'boolean') {
      return data.showTime;
    }

    const defaultStartTime = (Array.isArray(data.showTime?.defaultValue) && data.showTime.defaultValue[0]);
    const defaultEndTime = Array.isArray(data.showTime?.defaultValue) && data.showTime.defaultValue[1];

    const defaultStartTimeStr = defaultStartTime ? `moment('${data.showTime.defaultValue[0]}', 'HH:mm:ss')`
      : 'null';
    const defaultEndTimeStr = defaultEndTime ? `moment('${data.showTime.defaultValue[1]}', 'HH:mm:ss')`
      : 'null';

    if (defaultStartTime || defaultEndTime) defaultDeps.push({
      from: 'moment',
      default: 'moment'
    });
    return defaultStartTime || defaultEndTime
      ? () => `{
          defaultValue: [ ${defaultStartTimeStr}, ${defaultEndTimeStr}]
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
      ...defaultDeps,
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
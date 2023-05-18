import { Data } from './types';

export default function ({ data }: RuntimeParams<Data>) {
    const str = `<TimePicker.RangePicker
                  placeholder={${JSON.stringify(data.placeholder)}}
                  allowClear
                  disabled={${data.disabled}}
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
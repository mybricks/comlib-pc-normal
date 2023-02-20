import { Data } from './types';

export default function ({ data }: RuntimeParams<Data>) {
    const str = `<div>
                   <TimePicker.RangePicker
                    placeholder={${data.placeholder}}
                    allowClear
                    disabled={${data.disabled}}
                   />
                 </div>`

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
import { AutoCompleteProps } from 'antd';
import {  getPropsFromObject, getObjectStr } from '../../utils/toReact';
import { Data } from './runtime';

export default function ({ data }: RuntimeParams<Data>) {
    const AutoCompleteCls = {
    };
    const AutoCompleteCfg: AutoCompleteProps = {
        ...data.config,
        filterOption: data.isFilter,
        //value: data.value,
        //options: data.staticOptions
        // onChange,
        // onBlur,
        // onSearch,
        // notFoundContent
    };

    const str = `<AutoComplete
                    ${getPropsFromObject(AutoCompleteCfg)}
                    style={{ width: '100%' }}
                    ${data.options.length !==0 ? `options={${JSON.stringify(data.staticOptions)}}` : ''}
                   />`

    return {
        imports: [
            {
                from: 'antd',
                coms: ['AutoComplete']
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
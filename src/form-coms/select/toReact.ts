import { SelectProps } from 'antd';
import { getObjectDistrbuteStr } from '../../utils/toReact';
import { Data } from './types';

export default function ({ data, slots }: RuntimeParams<Data>) {
    const selectCls = {
    };
    const selectCfg: SelectProps = {
        ...data.config,
        options: data.config.options,
        value: data.value,
        // onChange,
        // onBlur,
        // onSearch,
        // notFoundContent
    };

    const str = `<div ${getObjectDistrbuteStr(selectCls)}>
                   <Select
                    ${getObjectDistrbuteStr(selectCfg)}
                   />
                 </div>`

    return {
        imports: [
            {
                form: 'antd',
                coms: ['Select']
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
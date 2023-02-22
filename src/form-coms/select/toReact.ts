import { SelectProps } from 'antd';
import { getPropsFromObject } from '../../utils/toReact';
import { Data } from './types';

export default function ({ data, slots }: RuntimeParams<Data>) {
    const selectCls = {
    };

    const defaultSelectProps = {
        allowClear: false,
        loading: false,
        disabled: false,
        mode: 'default',
        labelInValue: false,
        showSearch: data.config.mode === "default",
        filterOption: true,
        optionFilterProp: 'value',
    };
    const selectProps: SelectProps = {
        ...data.config,
        options: data.config.options,
        value: data.value,
        mode: data.config.mode === 'default' ? void 0 : data.config.mode,
        // onChange,
        // onBlur,
        // onSearch,
        // notFoundContent
    };

    const str = `<div ${getPropsFromObject(selectCls)}>
                   <Select
                    ${getPropsFromObject(selectProps, defaultSelectProps)}
                   />
                 </div>`

    return {
        imports: [
            {
                from: 'antd',
                coms: ['Select']
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
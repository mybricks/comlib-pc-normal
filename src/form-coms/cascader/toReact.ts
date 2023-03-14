import { Data } from './runtime';

export default function ({ data }: RuntimeParams<Data>) {
    const CascaderCls = {
    };

    let configStr = ''
    Object.keys(data.config).forEach(key => {
      if (typeof data.config[key] !== 'undefined' && data.config[key] !== '') {
        configStr +=  typeof data.config[key] === 'boolean' || typeof data.config[key] === 'number' ? `${key}={${data.config[key]}}` : `${key}="${data.config[key]}"` + ' '
      }
    })
    
    const str = `<Cascader
                  ${configStr}
                  style={{ width: '100%' }}
                  multiple={${data.isMultiple}}
                  />`

    return {
        imports: [
            {
                from: 'antd',
                coms: ['Cascader']
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
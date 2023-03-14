import { Data } from './types';

export default function ({ data }: RuntimeParams<Data>) {
  let radioStr = data.staticOptions.map((item, radioIdx)=>{
    const label = item.label;
    return (
        `<Radio
          value="${item.value}"
          ${item.disabled !== undefined ? `disabled={${item.disabled}}`: ''}
          checked={${item.checked}}
          style={{ marginRight: 8}}
        >
        ${label}
      </Radio>`
    )
  })

  const str = `<Radio.Group
                defaultValue={${JSON.stringify(data.value)}} 
                disabled={${data.config.disabled}}
                >
                  ${radioStr}
                </Radio.Group>`
                  

    return {
        imports: [
            {
                from: 'antd',
                coms: ['Radio']
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
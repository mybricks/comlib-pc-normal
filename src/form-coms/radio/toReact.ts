import { Data } from './types';

export default function ({ data }: RuntimeParams<Data>) {
  let radioStr = data.staticOptions.map((item, radioIdx)=>{
    const label = item.label;
    return (
        `<Radio
          value="${item.value}"
          disabled={${item.disabled}}
          checked={${item.checked}}
          style={{ marginRight: 8}}
        >
        ${label}
      </Radio>`
    )
  })

  const str = `<div>
                  <Radio.Group 
                  disabled={${data.config.disabled}}
                  >
                    ${radioStr}
                  </Radio.Group>
              </div>`

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
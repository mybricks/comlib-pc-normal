import { Data } from './types';

export default function ({ data }: RuntimeParams<Data>) {
    const str = `<div>
                  ${data.checkAll ? (
                    `<Checkbox>
                      ${data.checkAllText}
                    </Checkbox>`
                  ): ''} 
                  <Checkbox.Group
                  disabled={${data.config.disabled}}
                  ${data.config.options.length !==0 ? `options={${JSON.stringify(data.staticOptions)}}` : ''}
                  />
                </div>`

    return {
        imports: [
            {
                from: 'antd',
                coms: ['Checkbox']
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
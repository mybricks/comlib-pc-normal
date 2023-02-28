import { Data } from './types';

export default function ({ data }: RuntimeParams<Data>) {
    let newOptions = data.staticOptions.map((item)=>{
      if(item.disabled !== undefined){
        return {
          label: item.label,
          value: item.value,
          disabled: item.disabled
        }
      }else{
        return {
          label: item.label,
          value: item.value,
        }
      }
    })
    
    const str = `${data.checkAll ? (
                  `<Checkbox disabled={${data.config.disabled}}>
                    ${data.checkAllText}
                  </Checkbox>`
                ): ''} 
                <Checkbox.Group
                disabled={${data.config.disabled}}
                ${data.value?.length !== 0 ? `value={${JSON.stringify(data.value)}}`: ''}
                ${data.config.options.length !==0 ? `options={${JSON.stringify(newOptions)}}` : ''}
                />`
                

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
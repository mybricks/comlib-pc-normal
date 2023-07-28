import { Data } from './types';

export default function ({ data }: RuntimeParams<Data>) {
  let newOptions = data.staticOptions.map((item) => {
    if (item.disabled !== undefined) {
      return {
        label: item.label,
        value: item.value,
        disabled: item.disabled
      }
    } else {
      return {
        label: item.label,
        value: item.value,
      }
    }
  })

  const str = data.renderError ?
    `<Alert message="多选框渲染错误：存在选项值未定义！" type="error" />`
    : `${data.checkAll ? (
      `<Checkbox disabled={${data.config.disabled}}>
        ${data.checkAllText}
      </Checkbox>`
    ) : ''} 
      <Checkbox.Group
        disabled={${data.config.disabled}}
        ${data.value?.length !== 0 ? `defaultValue={${JSON.stringify(data.value)}}` : ''}
        ${data.config.options.length !== 0 ? `options={${JSON.stringify(newOptions)}}` : ''}
      />`


  return {
    imports: [
      {
        from: 'antd',
        coms: data.renderError ? ['Alert'] : ['Checkbox']
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
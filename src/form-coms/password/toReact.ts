export default function ({ data }) {
  let str = `<Input.Password
              allowClear
              placeholder="${data.placeholder}"
              disabled={${data.disabled || false}}
              />`

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Input']
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
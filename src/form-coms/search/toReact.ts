export default function ({ data }) {
  let configStr = ''
  Object.keys(data.config).forEach(key => {
    if (typeof data.config[key] !== 'undefined' && data.config[key] !== '') {
      configStr +=  typeof data.config[key] === 'boolean' || typeof data.config[key] === 'number' ? `${key}={${data.config[key]}}` : `${key}="${data.config[key]}"` + ' '
    }
  })

  let str = `<Input.Search ${configStr} />`         

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
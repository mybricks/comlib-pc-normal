
export default function ({ data }) {
  const btnClass = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }

  const str = `<div ${!data.asMapArea ? `style={${getObjectStr({ ...btnClass, ...data.style })}}` : ''}>${data.text}</div>`

  return {
    imports: [
      // {
      //   from: 'antd',
      //   coms: ['Button']
      // }
    ],
  	jsx: str,
    style: '',
    js: ''
  }
}

function getObjectStr (obj) {

  return JSON.stringify(obj)
}
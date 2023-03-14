export default function ({ data }) {
  // const str = `<div ${!data.asMapArea ? `style={${getObjectStr({ ...btnClass, ...data.style })}}` : ''}>${data.text}</div>`

  const style = {
    ...(data.asMapArea ? {} : data.style),
    width: `100%`,
    height: `100%`
  };
  if (Object.hasOwn(style, 'styleEditorUnfold')) {
    delete style.styleEditorUnfold;
  }
  const jsx = `<Button style={${getObjectStr(style)}}>${!data.asMapArea ? data.text : ''}</Button>`;

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Button']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      }
    ],
    jsx,
    style: '',
    js: ''
  };
}

function getObjectStr(obj) {
  return JSON.stringify(obj);
}

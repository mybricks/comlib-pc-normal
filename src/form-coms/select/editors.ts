export default {
  '@parentUpdated'({id, data, parent}, {schema}) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      parent['@_setFormItem']({id, name: data.name, schema: {type: 'string'}})
    }
    // if (schema === 'mybricks.normal-pc.form-container/form-item') {//in form container
    //   data.type = 'formItem'
    //
    //   parent['@_setFormItem']({id, name: data.name, schema: {type: 'string'}})//use parents API
    // } else {
    //   data.type = 'normal'
    // }
  },
  ':root' ({data}: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '事件',
        items: [
          {
            title: '值发生改变',
            type: '_event',
            options: {
              outputId: 'onChange'
            }
          }
        ]
      },
    ]
  }
}
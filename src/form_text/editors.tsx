export default {
  // '@parentUpdated'({id, data, parent}, {schema}) {
  //   // if (schema === 'mybricks.normal-pc.form-container/form-item') {//in form container
  //   //   data.type = 'formItem'
  //   //
  //   //   parent['@_setFormItem']({id, name: data.name, schema: {type: 'string'}})//use parents API
  //   // } else {
  //   //   data.type = 'normal'
  //   // }
  // },
  ':root'({data}: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '显示前置文本',
        type: 'switch',
        description: '带标签的 input，设置前置标签',
        value: {
          get({data}) {
            return data.addonBefore
          },
          set({data}, value: boolean) {
            data.addonBefore = value
          },
        },
      },
      {
        title: '前置文本',
        type: 'text',
        ifVisible({data}) {
          return data.addonBefore
        },
        value: {
          get({data}) {
            return data.title
          },
          set({data}, value: boolean) {
            data.title = value
          },
        },
      },
      {
        title: '事件',
        items: [
          {
            title: '值发生改变',
            type: '_event',
            options: {
              outputId: 'valueChanged'
            }
          }
        ]
      },
    ]
  }
}
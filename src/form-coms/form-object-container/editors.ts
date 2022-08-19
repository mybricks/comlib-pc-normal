import { Data } from './runtime'

function refreshSchema({data, inputs, outputs}) {
  const properties = {}
  data.items.forEach(item => {
    const {id, label, schema, name } = item
    properties[name] = { ...schema, title: label }
  })

  const schema = {
    type: 'object',
    properties
  }

  outputs.get('onFinish').setSchema(schema)
  inputs.get('initial').setSchema(schema)
}

export default {
  '@childRemove'({data, inputs, outputs, logs}, {id, title}) {
    data.items = data.items.filter(item => item.id !== id)
  },
  '@_setFormItem'({data, inputs, outputs, children, logs, parent}, {id, schema}) {//As schema
    const item = data.items.find(item => item.id === id)
    
    if (item) {
      item.schema = schema
    } else {
      const nowC = data.nameCount++

      data.items.push({
        id,
        schema,
        name: `item${nowC}`,
        label: `表单项${nowC}`
      })
      console.log(data.items, parent, schema)
    }
  },
  '@parentUpdated'({id, data, parent}, {schema}) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      parent['@_setFormItem']({id, schema: { type: 'object', properties: {} }})
    }
  },
  ':root': [
    {
      title: '事件',
      items: [
        {
          title: '初始化',
          type: '_event',
          options: {
            outputId: 'onInitial'
          }
        }
      ]
    },
  ],
}
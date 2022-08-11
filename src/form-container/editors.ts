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

    refreshSchema({data, inputs, outputs})
  },
  '@_setFormItem'({data, inputs, outputs, children, logs}, {id, schema}) {//As schema
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
    }
  
    refreshSchema({data, inputs, outputs})
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
  '[data-formitem]': [
    {
      title: '标题',
      type: 'text',
      value: {
        get({data, focusArea}: EditorResult<Data>) {
          const comId = focusArea.dataset['formitem']
          return data.items.find(item => item.id === comId).label
        },
        set({data, focusArea}: EditorResult<Data>, val) {
          const comId = focusArea.dataset['formitem']
          const item = data.items.find(item => item.id === comId)
          item.label = val
        }
      }
    },
    {
      title: '字段',
      type: 'text',
      value: {
        get({data, focusArea}: EditorResult<Data>) {
          const comId = focusArea.dataset['formitem']
          return data.items.find(item => item.id === comId).name
        },
        set({data, focusArea}: EditorResult<Data>, val) {
          const comId = focusArea.dataset['formitem']
          const item = data.items.find(item => item.id === comId)
          item.name = val
        }
      }
    }
  ],
  '[data-form-actions]': [
    {
      title: '添加操作',
      type: 'Button',
      value: {
        set({data, focusArea}: EditorResult<Data>) {
          console.log('add')
        }
      }
    },
  ]
}
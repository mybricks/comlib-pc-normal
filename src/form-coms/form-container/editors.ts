import { message } from 'antd'
import { Data } from './types'
import { FormLayout } from 'antd/es/form/Form'
import { uuid } from '../../utils'

function refreshSchema({data, inputs, outputs, slots}) {
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
  outputs.get('onClickSubmit').setSchema(schema)
  inputs.get('setFieldsValue').setSchema(schema)
  slots?.get('content').inputs.get('setFieldsValue').setSchema(schema)
}

export default {
  '@childRemove'({data, inputs, outputs, logs, slots}, {id, title}) {
    data.items = data.items.filter(item => item.id !== id)
    refreshSchema({data, inputs, outputs, slots})
  },
  '@_setFormItem'({data, inputs, outputs, children, logs, slots}, {id, schema}) {//As schema
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
    refreshSchema({data, inputs, outputs, slots})
  },
  '@parentUpdated'({id, data, parent}, {schema}) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      parent['@_setFormItem']({id, schema: { type: 'object', properties: {} }})
      data.isFormItem = true
    } else {
      data.isFormItem = false
    }
  },
  ':root': [
    {
      title: '布局',
      type: 'Select',
      options: [
        { label: '水平', value: 'horizontal' },
        { label: '垂直', value: 'vertical' },
        { label: '内联', value: 'inline' },
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.layout
        },
        set({ data }: EditorResult<Data>, value: FormLayout) {
          data.layout = value
        },
      }
    },
    {
      title: '操作区',
      items: [
        {
          title: '显示操作',
          type: 'Switch',
          value: {
            get({data}: EditorResult<Data>) {
              return data.actions.visible
            },
            set({data}: EditorResult<Data>, val) {
              data.actions.visible = val
            }
          }
        }
      ]
    }
    // {
    //   title: '数据类型',
    //   type: 'select',
    //   options: [
    //     { label: '对象', value: 'object' },
    //     { label: '列表', value: 'list' }
    //   ],
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.dataType
    //     },
    //     set({ data }: EditorResult<Data>, val) {
    //       data.dataType = val
    //     }
    //   }
    // },
    // {
    //   title: '事件',
    //   items: [
    //     {
    //       title: '初始化',
    //       type: '_event',
    //       options: {
    //         outputId: 'onInitial'
    //       }
    //     }
    //   ]
    // },
  ],
  '[data-formitem]': {
    title: '表单项',
    items: [
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
      },
      {
        title: '必填样式',
        type: 'Switch',
        value: {
          get({data, focusArea}: EditorResult<Data>) {
            const comId = focusArea.dataset['formitem']
            return data.items.find(item => item.id === comId).required
          },
          set({data, focusArea}: EditorResult<Data>, val) {
            const comId = focusArea.dataset['formitem']
            const item = data.items.find(item => item.id === comId)
            item.required = val
          }
        }
      }
    ]
  },
  '[data-form-actions]': {
    title: '操作区',
    items: [
      {
        title: '显示操作',
        type: 'Switch',
        value: {
          get({data}: EditorResult<Data>) {
            return data.actions.visible
          },
          set({data}: EditorResult<Data>, val) {
            data.actions.visible = val
          }
        }
      },
      {
        title: '添加操作',
        type: 'Button',
        value: {
          set({data, output}: EditorResult<Data>) {
            const actions = data.actions.items
            const outputId = uuid()
            const title = `操作${actions.length + 1}`
            const item = {
              title: title,
              key: outputId,
              outputId,
              isDefault: false,
            }
            output.add(outputId, `点击${title}`, { type: 'any' })
            actions.push(item)
          }
        }
      },
    ]
  },
  '[data-form-actions-item]': {
    title: '操作',
    items: [
      {
        title: '标题',
        type: 'text',
        value: {
          get({data, focusArea}: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string
            console.log(focusArea, data.actions.items.find(item => item.key === comId))
            return comId && data.actions.items.find(item => item.key === comId)?.title
          },
          set({data, focusArea, output}: EditorResult<Data>, val) {
            if (!val) {
              return message.warn('操作标题不能为空')
            }

            const comId = focusArea.dataset['formActionsItem']
            const item = data.actions.items.find(item => item.key === comId)
            if (item) {
              item.title = val
              output.setTitle(item.outputId, `点击${item.title}`)
            }
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_event',
            options ({ data, focusArea }) {
              const comId = focusArea.dataset['formActionsItem']
              const item = data.actions.items.find(item => item.key === comId)
              if (!item) return 

              return  {
                outputId: item.outputId
              }
            }
          }
        ]
      },
      {
        title: '删除',
        type: 'Button',
        ifVisible ({ data, focusArea }) {
          const actions = data.actions.items
          const itemId = focusArea.dataset['formActionsItem']
          const item = actions.find(item => item.key === itemId)

          return item && !item?.isDefault
        },
        value: {
          set({data, output, focusArea}: EditorResult<Data>) {
            const actions = data.actions.items
            const itemId = focusArea.dataset['formActionsItem']
            const index = actions.findIndex(item => item.key === itemId)
            const item = data.actions.items[index]

            output.remove(item.outputId)
            actions.splice(index, 1)
          }
        }
      },
    ]
  }
}
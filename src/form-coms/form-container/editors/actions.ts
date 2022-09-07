import { Data } from '../types'
import { uuid } from '../../../utils'

export const actionsEditor = {
  title: '操作区',
  items: [
    {
      title: '显示操作区',
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
      title: '显示提交操作',
      type: 'Switch',
      value: {
        get({data}: EditorResult<Data>) {
          return data.actions.items.find(item => item.key === 'submit')?.visible
        },
        set({data}: EditorResult<Data>, val) {
          const submitItem = data.actions.items.find(item => item.key === 'submit')
          if (submitItem) {
            submitItem.visible = val
          }
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
}
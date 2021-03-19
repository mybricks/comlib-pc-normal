import {REG} from "../items";

export default {
  '[data-form-item]': {
    title: '表单项',
    items: [
      {
        title: '标题',
        type: 'text',
        value: {
          get({data, focusArea}) {
            const fieldName = focusArea.dataset.formItem
            const formItem = getFormItem(fieldName, {data})
            return formItem.label
          },
          set({data, focusArea}, val) {
            const fieldName = focusArea.dataset.formItem
            const formItem = getFormItem(fieldName, {data})
            formItem.label = val
          }
        }
      },
      {
        title: '字段名',
        type: 'text',
        value: {
          get({data, focusArea}) {
            const fieldName = focusArea.dataset.formItem
            const formItem = getFormItem(fieldName, {data})
            return formItem.name
          },
          set({data, focusArea}, val) {
            const fieldName = focusArea.dataset.formItem
            const formItem = getFormItem(fieldName, {data})
            formItem.name = val
          }
        }
      },
      {
        title: '类型',
        type: 'select',
        options() {
          return REG.map(reg => ({value: reg.type, label: reg.title}))
        },
        // options: [
        //   {value: 'text', label: '文本'},
        //   {value: 'password', label: '密码'}
        // ],
        value: {
          get({data, focusArea}) {
            const fieldName = focusArea.dataset.formItem
            const formItem = getFormItem(fieldName, {data})
            return formItem.type
          },
          set({data, focusArea}, val) {
            const fieldName = focusArea.dataset.formItem
            const formItem = getFormItem(fieldName, {data})
            formItem.type = val
          }
        }
      },
      {
        title: '删除',
        type: 'button',
        value: {
          set({data, focusArea}: T_EdtArgs, val) {
            const fieldName = focusArea.dataset.formItem
            const formItem = getFormItem(fieldName, {data})
            const idx = data.formItems.indexOf(formItem)
            data.formItems.splice(idx, 1)
          }
        }
      }
    ]
  }
}

function getFormItem(fieldName: string, {data}) {
  return data.formItems.find(item => item.name === fieldName)
}
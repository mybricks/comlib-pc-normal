import { Data } from '../runtime'

function getFromItemIndex (focusArea) {
  const index = ~~focusArea.dataset.checkboxFormItemIndex
  return index
}

function getCheckboxItem (data: Data, focusArea) {
  const formItem = data.formItems[getFromItemIndex(focusArea)]
  const checkboxItem = formItem.checkboxOptions && formItem.checkboxOptions[focusArea.index]
  return checkboxItem
}

export default {
  '[data-checkbox-form-item-index]': {
    title: '多选框',
    items: [
      {
        title: '标题',
        type: 'Text',
        description: '多选框显示文字',
        value: {
          get ({data, focusArea}: EditorResult<Data>) {
            if (!focusArea) return
            const checkboxItem = getCheckboxItem(data, focusArea)

            return checkboxItem?.label
          },
          set ({data, focusArea}: EditorResult<Data>, value: string) {
            if (!focusArea) return
            const checkboxItem = getCheckboxItem(data, focusArea)
            if (!checkboxItem) return
            checkboxItem.label = value
          }
        }
      },
      {
        title: '值',
        type: 'Text',
        description: '多选框的值',
        value: {
          get ({data, focusArea}: EditorResult<Data>) {
            if (!focusArea) return
            const checkboxItem = getCheckboxItem(data, focusArea)

            return checkboxItem?.value
          },
          set ({data, focusArea}: EditorResult<Data>, value: string) {
            if (!focusArea) return
            const checkboxItem = getCheckboxItem(data, focusArea)
            if (!checkboxItem) return
            checkboxItem.value = value
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        value: {
          set ({data, focusArea}: EditorResult<Data>) {
            if (!focusArea) return
            const formItem = data.formItems[getFromItemIndex(focusArea)]
            if (formItem.checkboxOptions) {
              formItem.checkboxOptions.splice(focusArea.index, 1)
            }
            
          }
        }
      },
    ]
  }
}
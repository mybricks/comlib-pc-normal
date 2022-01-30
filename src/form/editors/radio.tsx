import { Data, OptionType } from '../runtime'
import { addFormItem } from './index'

function getFromItemIndex (focusArea) {
  const index = ~~focusArea.dataset.radioFormItemIndex
  return index
}

function getRadioItem (data: Data, focusArea) {
  const formItem = data.formItems[getFromItemIndex(focusArea)]
  const radioItem = formItem.radioOptions && formItem.radioOptions[~~focusArea.dataset.radioFormItemRadioIndex]
  return radioItem
}

export default {
  '[data-radio-form-item-index]': {
    title: '单选框',
    items: [
      {
        title: '标题',
        type: 'Text',
        description: '单选框显示内容',
        value: {
          get ({data, focusArea}: EditorResult<Data>) {
            if (!focusArea) return
            const radioItem = getRadioItem(data, focusArea)

            return radioItem?.label
          },
          set ({data, focusArea}: EditorResult<Data>, value: string) {
            if (!focusArea) return
            const radioItem = getRadioItem(data, focusArea)
            if (!radioItem) return
            radioItem.label = value
          }
        }
      },
      {
        title: '值',
        type: 'Text',
        description: '单选框提交的值',
        ifVisible ({data, focusArea}: EditorResult<Data>) {
          if (!focusArea) return
          const radioItem = getRadioItem(data, focusArea)

          return radioItem?.type === 'default' || typeof radioItem?.type === 'undefined'
        },
        value: {
          get ({data, focusArea}: EditorResult<Data>) {
            if (!focusArea) return
            const radioItem = getRadioItem(data, focusArea)

            return radioItem?.value
          },
          set ({data, focusArea}: EditorResult<Data>, value: string) {
            if (!focusArea) return
            const radioItem = getRadioItem(data, focusArea)
            if (!radioItem) return
            radioItem.value = value
          }
        }
      },
      {
        title: '支持动态输入',
        ifVisible ({data, focusArea}: EditorResult<Data>) {
          if (!focusArea) return
          const radioItem = getRadioItem(data, focusArea)
          return radioItem?.type === 'default' || typeof radioItem?.type === 'undefined'
        },
        items: [
          {
            title: '开启动态输入',
            type: 'Switch',
            value: {
              get ({data, focusArea}: EditorResult<Data>) {
                if (!focusArea) return
                const radioItem = getRadioItem(data, focusArea)
                return radioItem?.dynamicInput
              },
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return
                const radioItem = getRadioItem(data, focusArea)
                radioItem.dynamicInput = value
              }
            }
          },
          {
            title: '输入框宽度',
            type: 'Text',
            options: {
              type: 'number'
            },
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return
              const radioItem = getRadioItem(data, focusArea)
              return radioItem.dynamicInput
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                if (!focusArea) return
                const radioItem = getRadioItem(data, focusArea)
                radioItem.width = value
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return
                const radioItem = getRadioItem(data, focusArea)
                return radioItem.width
              }
            }
          },
          {
            title: 'placeholder',
            type: 'Text',
            ifVisible({ data, focusArea }: EditorResult<Data>) {
              if (!focusArea) return
              const radioItem = getRadioItem(data, focusArea)
              return radioItem.dynamicInput
            },
            value: {
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                if (!focusArea) return
                const radioItem = getRadioItem(data, focusArea)
                radioItem.inputPlaceholder = value
              },
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return
                const radioItem = getRadioItem(data, focusArea)
                return radioItem.inputPlaceholder
              }
            }
          }
        ]
      },
      {
        title: '类型',
        type: 'Select',
        options: [
          { label: '默认', value: 'default' },
          { label: '自定义组合', value: 'composition'}
        ],
        value: {
          get ({data, focusArea}: EditorResult<Data>) {
            if (!focusArea) return
            const radioItem = getRadioItem(data, focusArea)
            return radioItem?.type || 'default'
          },
          set ({data, focusArea}: EditorResult<Data>, value: OptionType) {
            if (!focusArea) return
            const formItem = data.formItems[getFromItemIndex(focusArea)]
            const radioItem = getRadioItem(data, focusArea)
            if (!radioItem) return
            if (value === 'composition') {
              if (typeof formItem.radioCompositionItems === 'undefined') {
                formItem.radioCompositionItems = {}
              }
              const radioCompositionItems = formItem.radioCompositionItems[radioItem.key]

              if (!radioCompositionItems || radioCompositionItems.length <= 0) {
                formItem.radioCompositionItems[radioItem.key] = []
                addFormItem(formItem.radioCompositionItems[radioItem.key])
              }
              radioItem.value = ''
            }
            radioItem.type = value
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        description: '单选框提交的值',
        value: {
          set ({data, focusArea}: EditorResult<Data>) {
            if (!focusArea) return
            const formItem = data.formItems[getFromItemIndex(focusArea)]
            if (formItem.radioOptions) {
              formItem.radioOptions.splice(focusArea.index, 1)
            }
          }
        }
      },
    ]
  },
  '.radio-btnGrp': {
    title: '单选按钮',
    items: [
      {
        title: '标题',
        type: 'Text',
        description: '单选框显示内容',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            // if (!focusArea) return
            const radioItem = getRadioItem(data, focusArea)

            return radioItem?.label
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return
            const radioItem = getRadioItem(data, focusArea)
            if (!radioItem) return
            radioItem.label = value
          }
        }
      },
      {
        title: '值',
        type: 'Text',
        description: '单选框提交的值',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return
          const radioItem = getRadioItem(data, focusArea)

          return radioItem?.type === 'default' || typeof radioItem?.type === 'undefined'
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return
            const radioItem = getRadioItem(data, focusArea)

            return radioItem?.value
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return
            const radioItem = getRadioItem(data, focusArea)
            if (!radioItem) return
            radioItem.value = value
          }
        }
      },
    ]
  }
}
import {Data, LayoutModel} from "../form/runtime";
import {FormLayout} from "antd/es/form/Form";

function refreshSchema({data, inputs, outputs}) {
  const properties = {}
  data.items.forEach(item => {
    const {id, label, schema} = item
    properties[label] = schema
  })

  const schema = {
    type: 'object',
    properties
  }

  outputs.get('submit').setSchema(schema)
}

export default {
  '@childRemove'({data, inputs, outputs, logs}, {id, title}) {
    data.items = data.items.filter(item => item.id !== id)

    refreshSchema({data, inputs, outputs})
  },
  // '@_setFormItem'({data, inputs, outputs, children, logs}, {id, schema}) {//As schema
  //   const item = data.items.find(item => item.id === id)
  //   if (item) {
  //     item.schema = schema
  //   } else {
  //     data.items.push({id, schema})
  //   }
  //
  //   refreshSchema({data, inputs, outputs})
  // },
  ':root': ({data}: EditorResult<Data>, ...editList) => {
    editList[0].title = '常规';
    editList[0].items = [
      {
        title: '布局',
        type: 'select',
        options: [
          {
            label: '垂直布局',
            value: 'flex-column'
          },
          {
            label: '水平布局',
            value: 'flex-row'
          }
        ],
        description: '表单项的布局方式',
        value: {
          get({data}: EditorResult<Data>) {
            return data.immediate
          },
          set({data}: EditorResult<Data>, value: boolean) {
            data.immediate = value
          },
        },
      }
    ]

    editList[1].title = '样式';
    editList[1].items = [
      {
        title: '布局',
        type: 'Select',
        options: [
          {label: '内联', value: 'inline'},
          {label: '行', value: 'row'},
          {label: '列', value: 'column'},
        ],
        value: {
          set({data}: EditorResult<Data>, value: LayoutModel) {
            const layoutMap: Record<string, FormLayout> = {
              row: 'horizontal',
              column: 'vertical',
              inline: 'inline'
            }

            data.layoutModel = value
            data.layout = layoutMap[value]
            data.isFollow = value === 'inline'

            if (value === 'inline') {
              data.columnCount = data.columnCount === 1 ? 3 : data.columnCount
              // data.formItems.map(item => {
              //   if (item.cusMargin) {
              //     // item.cusMargin[3] = 16
              //   } else {
              //     item.cusMargin = [0, 24, 0, 16]
              //   }
              //   return item
              // })
              // data.showLabel = false
            } else if (value === 'column') {
              data.columnCount = 1
              // data.showLabel = true
            } else {
              // data.formItems.map(item => {
              //   if (!item.cusMargin) {
              //     item.cusMargin = [0, 24, 0, 0]
              //   }
              //   return item
              // })
              // data.showLabel = true
            }
          },
          get({data}: EditorResult<Data>) {
            if (typeof data.layoutModel === 'undefined') {
              data.layoutModel = data.layout === 'inline' ? data.layout : 'row'
            }
            return data.layoutModel
          },
        },
      },
      {
        title: '样式',
        type: 'Style',
        options: ['BGCOLOR'],
        value: {
          get({data}) {
            return data.bgColor
          },
          set({data}, value: any) {
            data.bgColor = value
          }
        }
      },
    ];

    editList[2].title = '事件';
    editList[2].items = [
      {
        title: '数据提交',
        type: '_Event',
        options: () => {
          return {
            outputId: 'submit'
          };
        }
      },
      {
        title: '重置完成',
        type: '_Event',
        options: () => {
          return {
            outputId: 'afterReset'
          };
        }
      }
    ]
  },
  '[data-formitem]': [
    {
      title: '标题',
      type: 'text',
      value: {
        get({data, focusArea}) {
          const comId = focusArea.dataset['formitem']
          return data.items.find(item => item.id === comId).label
        },
        set({data, focusArea}, val) {
          const comId = focusArea.dataset['formitem']
          const item = data.items.find(item => item.id === comId)
          item.label = val
        }
      }
    },
    {
      title: '字段名',
      type: 'text',
      value: {
        get({data, focusArea}) {
          const comId = focusArea.dataset['formitem']
          return data.items.find(item => item.id === comId).name
        },
        set({data, focusArea}, val) {
          const comId = focusArea.dataset['formitem']
          const item = data.items.find(item => item.id === comId)
          item.name = val
        }
      }
    }
  ]
}
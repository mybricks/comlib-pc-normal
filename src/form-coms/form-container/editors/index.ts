import { message } from 'antd'
import { Data, LabelWidthType } from '../types'
import { FormLayout } from 'antd/es/form/Form'
import { actionsEditor } from './actions'
import { outputIds, inputIds, slotInputIds } from '../constants'
import { uuid } from '../../../utils'

function getSubmitSchema (data) {
  const properties = {}
  data.items.forEach(item => {
    const {id, label, schema, name } = item
    properties[name] = { ...schema, title: label }
  })

  const schema = {
    type: 'object',
    properties
  }

  return schema
}

function refreshSchema({data, inputs, outputs, slots}) {
  const schema = getSubmitSchema(data)
  
  outputs.get(outputIds.ON_FINISH).setSchema(schema)
  outputs.get(outputIds.ON_CLICK_SUBMIT).setSchema(schema)
  refreshParamsSchema(data, outputs)
  inputs.get(inputIds.SET_FIELDS_VALUE).setSchema(schema)
  slots?.get('content').inputs.get(slotInputIds.SET_FIELDS_VALUE).setSchema(schema)
}

function refreshParamsSchema (data, outputs) {
  const schema = getSubmitSchema(data)
  if (data.paramsSchema?.type === 'object' ) {
    schema.properties = { ...schema.properties, ...data.paramsSchema.properties }
  }

  outputs.get(outputIds.ON_MERGE_FINISH).setSchema(schema)
}

function fieldNameCheck (data: Data, name: string) {
  const fieldNameList = data.items.map(item => item.name)
  if (fieldNameList.includes(name)) {
    return true
  } else {
    return false
  }
}

function isHorizontal (data: Data) {
  return data.layout === 'horizontal'
}

export default {
  '@inputConnected'({ data, outputs }, fromPin, toPin) {
    if (toPin.id === inputIds.SUBMIT_AND_MERGE) {
      if (fromPin.schema.type === 'object') {
        data.paramsSchema = fromPin.schema
      } else {
        data.paramsSchema = {}
      }
      refreshParamsSchema(data, outputs)
    }
    
  },
  '@inputDisConnected'({ data, outputs }, fromPin, toPin) {
    if (toPin.id === inputIds.SUBMIT_AND_MERGE) {
      data.paramsSchema = {}
      refreshParamsSchema(data, outputs)
    }
    
  },
  '@childAdd' ({data, inputs, outputs, logs, slots}, child) {
    const { id, inputDefs, outputDefs } = child
    const item = data.items.find(item => item.id === id)
    const com = outputDefs.find(item => item.id === 'returnValue')
    
    if (item) {
      item.schema = com.schema
    } else {
      const nowC = data.nameCount++

      data.items.push({
        id,
        schema: com.schema,
        name: `item${nowC}`,
        label: `表单项${nowC}`,
        span: 24,
        visible: true,
      })
    }
    refreshSchema({data, inputs, outputs, slots})
  },
  '@childRemove'({data, inputs, outputs, logs, slots}, {id, title}) {
    data.items = data.items.filter(item => item.id !== id)
    refreshSchema({data, inputs, outputs, slots})
  },
  // '@_setFormItem'({data, inputs, outputs, children, logs, slots}, {id, schema}) {//As schema
  //   const item = data.items.find(item => item.id === id)
  //   // console.log('_setFormItem', id)
  //   if (item) {
  //     // console.log('_setFormItem item')
  //     item.schema = schema
  //   } else {
  //     const nowC = data.nameCount++

  //     data.items.push({
  //       id,
  //       schema,
  //       name: `item${nowC}`,
  //       label: `表单项${nowC}`,
  //       span: 24,
  //       visible: true,
  //     })
  //   }
  //   refreshSchema({data, inputs, outputs, slots})
  // },
  '@parentUpdated'({id, data, parent}, {schema}) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      // parent['@_setFormItem']({id, schema: { type: 'object', properties: {} }})
      data.isFormItem = true
      data.actions.visible = false
    } else {
      data.isFormItem = false
    }
  },
  // '@init': ({ data, setDesc, setAutoRun, isAutoRun, slot }) => {
  //   console.log(slot)
  // },
  ':root': ({ data, output }: EditorResult<Data>, cate1) => {
    cate1.items = [
      {
        title: '布局',
        items: [
          {
            title: '类型',
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
            title: '每行列数',
            type: 'Slider',
            description: '每行的表单项个数',
            options: [{ max: 6, min: 1, steps: 1, formatter: '个/行' }],
            value: {
              get({ data }: EditorResult<Data>) {
                return data.formItemColumn
              },
              set({ data }: EditorResult<Data>, value: number) {
                data.formItemColumn = value
                data.actions.span = Math.floor(24 / value)
              }
            }
          },
          {
            title: '标题',
            ifVisible({ data }: EditorResult<Data>) {
              return data.layout === 'horizontal'
            },
            items: [
              {
                title: '宽度类型',
                type: 'Select',
                options: [
                  { label: '固定像素', value: 'px' },
                  { label: '24 栅格', value: 'span' },
                ],
                value: {
                  get({ data }: EditorResult<Data>) {
                    return data.labelWidthType
                  },
                  set({ data }: EditorResult<Data>, value: LabelWidthType) {
                    data.labelWidthType = value
                  },
                }
              },
              {
                title: '标题宽度(px)',
                type: 'inputNumber',
                options: [{ min: 1 }],
                ifVisible({ data }: EditorResult<Data>) {
                  return data.labelWidthType === 'px'
                },
                value: {
                  get({ data }: EditorResult<Data>) {
                    return [data.labelWidth]
                  },
                  set({ data }: EditorResult<Data>, value: number) {
                    data.labelWidth = value[0]
                  }
                }
              },
              {
                title: '标题宽度(栅格)',
                type: 'Slider',
                options: [{ max: 24, min: 1, steps: 1, formatter: '格' }],
                ifVisible({ data }: EditorResult<Data>) {
                  return data.labelWidthType === 'span'
                },
                value: {
                  get({ data }: EditorResult<Data>) {
                    return data.labelCol
                  },
                  set({ data }: EditorResult<Data>, value: number) {
                    data.labelCol = value
                  }
                }
              }
            ]
          },
          {
            title: '表单项',
            items: [

            ]
          }
        ]
      },

      actionsEditor(data, output),
      // {
      //   title: '选择表单项',
      //   type: 'comSelector',
      //   options: {
      //     schema: 'mybricks.normal-pc.form-container/form-item',
      //     type: 'add'
      //   },
      //   value: {
      //     get () {

      //     },
      //     set({ data, slot }: EditorResult<Data>, namespace: string) {
      //       console.log(namespace)
      //       // data.selectComNameSpace = namespace;
      //       slot
      //         .get('content')
      //         .addCom(namespace, false, { deletable: true, movable: true });
      //     }
      //   }
      // }
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
    ]
  },
  ':child(mybricks.normal-pc.form-container/form-item)': {
    title: '表单项',
    items: [
      {
        title: '标题',
        type: 'text',
        value: {
          get({id, data, focusArea}: EditorResult<Data>) {
            return data.items.find(item => item.id === id)?.label
          },
          set({id, data, focusArea}: EditorResult<Data>, val) {
            const item = data.items.find(item => item.id === id)
            item.label = val
          }
        }
      },
      {
        title: '字段',
        type: 'text',
        value: {
          get({id, data, focusArea}: EditorResult<Data>) {
            return data.items.find(item => item.id === id)?.name
          },
          set({id, data, focusArea, input, output, slots }: EditorResult<Data>, val) {
            if (!val) {
              return message.warn('字段名不能为空')
            }

            const item = data.items.find(item => item.id === id)

            if (item && item.name !== val) {
              if (fieldNameCheck(data, val)) {
                return message.warn('字段名不能重复')
              }
              item.name = val
              
              refreshSchema({data, inputs: input, outputs: output, slots})
            }
          }
        }
      },
      {
        title: '必填样式',
        type: 'Switch',
        value: {
          get({id, data, focusArea}: EditorResult<Data>) {
            return data.items.find(item => item.id === id).required
          },
          set({id, data, focusArea}: EditorResult<Data>, val) {
            const item = data.items.find(item => item.id === id)
            item['required'] = val
          }
        }
      },
      // {
      //   title: '表单项',
      //   items: [
      //     {
      //       title: '宽度',
      //       type: 'Slider',
      //       options: [
      //         {
      //           max: 24,
      //           min: 1,
      //           step: 1,
      //           formatter: '/24',
      //         },
      //       ],
      //       // ifVisible({ data }: EditorResult<Data>) {
      //       //   return data.layout === 'horizontal'
      //       // },
      //       value: {
      //         get({ data, focusArea }: EditorResult<Data>) {
      //           const comId = focusArea.dataset['formitem']
      //           const item = data.items.find(item => item.id === comId)
      //           return item.span || 24
      //         },
      //         set({ data, focusArea }: EditorResult<Data>, value: number) {
      //           const comId = focusArea.dataset['formitem']
      //           const item = data.items.find(item => item.id === comId)
      //           item.span = value
      //         }
      //       },
      //     },
      //   ]
      // }
    ]
  },
  '[data-form-actions]': ({ data, output }: EditorResult<Data>, cate1) => {
    cate1.items = [actionsEditor(data, output)];
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
        title: '显示',
        type: 'Switch',
        ifVisible ({ data, focusArea }) {
          const actions = data.actions.items
          const itemId = focusArea.dataset['formActionsItem']
          const item = actions.find(item => item.key === itemId)

          return item?.key === 'submit'
        },
        value: {
          get({data, focusArea}: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string
            return data.actions.items.find(item => item.key === comId)?.visible
          },
          set({data, focusArea, output}: EditorResult<Data>, val) {

            const comId = focusArea.dataset['formActionsItem']
            const item = data.actions.items.find(item => item.key === comId)
            if (item) {
              item.visible = val
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
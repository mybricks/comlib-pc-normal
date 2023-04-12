import { message } from 'antd'
import { Data, FormItemColonType, LabelWidthType, FormItems } from '../types'
import { FormLayout } from 'antd/es/form/Form'
import { ButtonType } from 'antd/es/button/button'
import { actionsEditor } from './actions'
import { inputIds, outputIds } from '../constants'
import { refreshSchema, refreshParamsSchema } from '../schema'

function fieldNameCheck(data: Data, name: string) {
  const fieldNameList = data.items.map(item => item.name)
  if (fieldNameList.includes(name)) {
    return true
  } else {
    return false
  }
}

function getFormItemProp({ data, id }: { data: Data, id: string }, name: keyof FormItems) {
  try {
    const item = data.items.find(item => item.id === id);
    return item?.[name];
  } catch (e) {
    console.error(e);
  }
}
function setFormItemProps({ data, id }: { data: Data, id: string }, name: keyof FormItems, value: any) {
  try {
    const item = data.items.find(item => item.id === id) || {};
    item[name] = value;
  } catch (e) {
    console.error(e);
  }
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
  '@childAdd'({ data, inputs, outputs, logs, slots }, child) {
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
        name: '',
        label: `表单项${nowC}`,
        widthOption: 'span',
        span: 24 / data.formItemColumn,
        colon: 'default',
        labelAlign: 'default',
        labelAutoWrap: 'default',
        hiddenLabel: false,
        descriptionStyle: {
          whiteSpace: 'pre-wrap',
          lineHeight: '12px',
          letterSpacing: '0px',
          fontSize: '12px',
          fontWeight: 400,
          color: 'rgba(0, 0, 0, 0.45)',
          fontStyle: 'normal',
        },
        labelStyle: {
          lineHeight: '14px',
          letterSpacing: '0px',
          fontSize: '14px',
          fontWeight: 400,
          color: 'rgba(0, 0, 0, 0.85)',
          fontStyle: 'normal',
        },
        inlineMargin: [0, 16, 24, 0],
        visible: true,
      })
    }
    refreshSchema({ data, inputs, outputs, slots })
  },
  '@childRemove'({ data, inputs, outputs, logs, slots }, { id, title }) {
    // console.log('@childRemove', id, title)
    data.items = data.items.filter(item => item.id !== id)
    refreshSchema({ data, inputs, outputs, slots })
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
  '@parentUpdated'({ id, data, parent }, { schema }) {
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
                return data.config?.layout || data.layout
              },
              set({ data, inputs }: EditorResult<Data>, value: FormLayout) {
                data.config.layout = value
                // refreshFormItemPropsSchema({ data, inputs });
              },
            }
          },
          {
            title: '每行列数',
            type: 'Slider',
            description: '每行的表单项个数，可以实现平均分布各表单项及操作项，仅对“宽度配置”为“24栅格”的表单项及操作项生效',
            options: [{ max: 6, min: 1, steps: 1, formatter: '个/行' }],
            value: {
              get({ data }: EditorResult<Data>) {
                return data.formItemColumn
              },
              set({ data }: EditorResult<Data>, value: number) {
                data.formItemColumn = value
                data.actions.span = (24 / value)
                data.items.forEach(item => {
                  item.span = (24 / value);
                })
              }
            }
          },
          // {
          //   title: '表单项',
          //   items: [

          //   ]
          // }
        ]
      },
      {
        title: '标题',
        ifVisible({ data }: EditorResult<Data>) {
          return (data.config?.layout || data.layout) === 'horizontal'
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
          },
          {
            title: '显示冒号',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config?.colon || data.colon
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.config.colon = value
              },
            }
          },
          {
            title: '自动换行',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config?.labelWrap
              },
              set({ data }: EditorResult<Data>, value: boolean) {
                data.config.labelWrap = value
              },
            }
          },
          {
            title: '对齐方式',
            type: 'Radio',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '右对齐', value: 'right' }
            ],
            value: {
              get({ data }: EditorResult<Data>) {
                return data.config?.labelAlign
              },
              set({ data }: EditorResult<Data>, value: 'left' | 'right') {
                data.config.labelAlign = value
              },
            }
          },
        ]
      },
      {
        title: '提交隐藏表单项',
        type: 'Switch',
        description: '提交时收集被隐藏的表单项字段并进行校验',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.submitHiddenFields
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.submitHiddenFields = val
          }
        }
      },
      // {
      //   title: '禁用状态',
      //   type: 'Switch',
      //   description: '开启后，所以表单项和操作项都会被禁用',
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.config.disabled
      //     },
      //     set({ data }: EditorResult<Data>, val: boolean) {
      //       data.config.disabled = val
      //     }
      //   }
      // },
      !data.isFormItem && actionsEditor(data, output),
      {
        title: '事件',
        items: [
          {
            title: '字段值更新',
            type: '_event',
            options({ data }) {

              return {
                outputId: outputIds.ON_VALUES_CHANGE,
              }
            }
          }
        ]
      }
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
    ]
  },
  ':child(mybricks.normal-pc.form-container/form-item)': {
    title: '表单项',
    items: [
      {
        title: '隐藏标题',
        type: 'Switch',
        value: {
          get({ id, data }: EditorResult<Data>) {
            return getFormItemProp({ data, id }, 'hiddenLabel');
          },
          set({ id, data }: EditorResult<Data>, val) {
            setFormItemProps({ data, id }, 'hiddenLabel', val);
          }
        }
      },
      {
        title: '标题',
        type: 'text',
        ifVisible({ id, data }: EditorResult<Data>) {
          return !getFormItemProp({ data, id }, 'hiddenLabel');
        },
        value: {
          get({ id, data }: EditorResult<Data>) {
            return getFormItemProp({ data, id }, 'label');
          },
          set({ id, data }: EditorResult<Data>, val) {
            setFormItemProps({ data, id }, 'label', val);
          }
        }
      },
      {
        title: '字段',
        type: 'text',
        value: {
          get({ id, data, focusArea }: EditorResult<Data>) {
            const item = data.items.find(item => item.id === id)

            return item?.name || item?.label
          },
          set({ id, data, focusArea, input, output, slots }: EditorResult<Data>, val: string) {
            val = val.trim();
            if (!val) {
              return message.warn('字段名不能为空')
            }

            const item = data.items.find(item => item.id === id)

            if (item && item.name !== val) {
              if (fieldNameCheck(data, val)) {
                return message.warn('字段名不能重复')
              }
              item.name = val

              refreshSchema({ data, inputs: input, outputs: output, slots })
            }
          }
        }
      },
      {
        title: "标题提示",
        type: "Text",
        ifVisible({ id, data }: EditorResult<Data>) {
          return !getFormItemProp({ data, id }, 'hiddenLabel');
        },
        description: "展示在标题后面的悬浮提示内容",
        value: {
          get({ id, data }: EditorResult<Data>) {
            return getFormItemProp({ data, id }, 'tooltip');
          },
          set({ id, data }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, id }, 'tooltip', value);
          },
        },
      },
      {
        title: "提示语",
        type: "Text",
        description: "展示在表单项下方的提示内容",
        value: {
          get({ id, data }: EditorResult<Data>) {
            return getFormItemProp({ data, id }, 'description');
          },
          set({ id, data }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, id }, 'description', value);
          },
        },
      },
      {
        title: '样式',
        items: [
          {
            title: '宽度模式',
            type: 'Select',
            options: [
              {
                label: '24栅格',
                value: 'span'
              },
              {
                label: '固定宽度(px)',
                value: 'px'
              }
            ],
            value: {
              get({ data, id }: EditorResult<Data>) {
                return getFormItemProp({ data, id }, 'widthOption');
              },
              set({ data, id, inputs }: EditorResult<Data>, value: LabelWidthType) {
                setFormItemProps({ data, id }, 'widthOption', value);
                refreshFormItemPropsSchema({ data, inputs });
              }
            },
          },
          {
            title: '宽度配置(共24格)',
            type: 'Slider',
            options: [
              {
                max: 24,
                min: 1,
                step: 1,
                formatter: '/24',
              },
            ],
            ifVisible({ data, id }: EditorResult<Data>) {
              const item = data.items.find(item => item.id === id)
              return item?.widthOption !== 'px';
            },
            value: {
              get({ data, id }: EditorResult<Data>) {
                return getFormItemProp({ data, id }, 'span');
              },
              set({ data, id }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, id }, 'span', value);
              }
            },
          },
          {
            title: '宽度配置(px)',
            type: 'text',
            options: {
              type: 'number'
            },
            ifVisible({ data, id }: EditorResult<Data>) {
              const item = data.items.find(item => item.id === id)
              return item?.widthOption === 'px';
            },
            value: {
              get({ data, id }: EditorResult<Data>) {
                return getFormItemProp({ data, id }, 'width');

              },
              set({ data, id }: EditorResult<Data>, value: number) {
                setFormItemProps({ data, id }, 'width', value);
              }
            },
          },
          {
            title: '边距',
            type: 'inputNumber',
            options: [{ min: 0, title: '上' }, { min: 0, title: '右' }, { min: 0, title: '下' }, { min: 0, title: '左' }],
            ifVisible({ data }: EditorResult<Data>) {
              return (data.config?.layout || data.layout) !== 'horizontal'
            },
            value: {
              get({ id, data }: EditorResult<Data>) {
                return getFormItemProp({ data, id }, 'inlineMargin');
              },
              set({ id, data }: EditorResult<Data>, value: number[]) {
                setFormItemProps({ data, id }, 'inlineMargin', value);
              }
            }
          },
          {
            title: '边距应用其它表单项及操作项',
            type: 'Button',
            ifVisible({ data }: EditorResult<Data>) {
              return (data.config?.layout || data.layout) !== 'horizontal'
            },
            value: {
              set({ id, data }: EditorResult<Data>) {
                const curItem = data.items.find(item => item.id === id)
                const margin = curItem?.inlineMargin || [0, 16, 24, 0];
                data.items.forEach(item => item.inlineMargin = [...margin]);
                data.actions.inlinePadding = [...margin];
              }
            }
          },
          {
            title: '标题自动换行',
            type: 'Radio',
            ifVisible({ id, data }: EditorResult<Data>) {
              return !getFormItemProp({ data, id }, 'hiddenLabel');
            },
            options: [
              { label: '是', value: true },
              { label: '否', value: false },
              { label: '跟随容器配置', value: 'default' },
            ],
            value: {
              get({ id, data }: EditorResult<Data>) {
                return getFormItemProp({ data, id }, 'labelAutoWrap');
              },
              set({ id, data }: EditorResult<Data>, value: boolean) {
                setFormItemProps({ data, id }, 'labelAutoWrap', value);
              }
            }
          },
          {
            title: '标题对齐方式',
            type: 'Radio',
            ifVisible({ id, data }: EditorResult<Data>) {
              return !getFormItemProp({ data, id }, 'hiddenLabel');
            },
            options: [
              { label: '左对齐', value: 'left' },
              { label: '右对齐', value: 'right' },
              { label: '跟随容器配置', value: 'default' },
            ],
            value: {
              get({ id, data }: EditorResult<Data>) {
                return getFormItemProp({ data, id }, 'labelAlign');
              },
              set({ id, data }: EditorResult<Data>, value: 'left' | 'right') {
                setFormItemProps({ data, id }, 'labelAlign', value);
              }
            }
          },
          {
            title: '标题冒号',
            type: 'Radio',
            ifVisible({ id, data }: EditorResult<Data>) {
              return !getFormItemProp({ data, id }, 'hiddenLabel');
            },
            description: '当标题配置为空时，始终不展示冒号',
            options: [
              { label: '显示', value: true },
              { label: '隐藏', value: false },
              { label: '跟随容器配置', value: 'default' },
            ],
            value: {
              get({ id, data }: EditorResult<Data>) {
                return getFormItemProp({ data, id }, 'colon');
              },
              set({ id, data }: EditorResult<Data>, value: FormItemColonType) {
                setFormItemProps({ data, id }, 'colon', value);
              }
            }
          },
          {
            title: "标题样式",
            type: "Style",
            options: ['font'],
            ifVisible({ id, data }: EditorResult<Data>) {
              return !getFormItemProp({ data, id }, 'hiddenLabel');
            },
            description: "表单项标题的字体样式",
            value: {
              get({ id, data }: EditorResult<Data>) {
                const item = data.items.find(item => item.id === id);
                if (!item?.labelStyle) {
                  setFormItemProps({ data, id }, 'labelStyle', {
                    lineHeight: '14px',
                    letterSpacing: '0px',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontStyle: 'normal',
                  });
                }
                return item?.labelStyle;
              },
              set({ id, data }: EditorResult<Data>, value: any) {
                const { styleEditorUnfold, ...style } = value;
                setFormItemProps({ data, id }, 'labelStyle', style);
              },
            },
          },
          {
            title: '标题样式应用所有表单项',
            type: 'Button',
            ifVisible({ id, data }: EditorResult<Data>) {
              return !getFormItemProp({ data, id }, 'hiddenLabel');
            },
            value: {
              set({ id, data }: EditorResult<Data>, value: {}) {
                const item = data.items.find(item => item.id === id)
                const labelStyle = item?.labelStyle || {
                  lineHeight: '14px',
                  letterSpacing: '0px',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.85)',
                  fontStyle: 'normal',
                };
                data.items.forEach(item => item.labelStyle = labelStyle);
              }
            }
          },
          {
            title: "提示语样式",
            type: "Style",
            options: ['font'],
            description: "表单项提示语的字体样式",
            value: {
              get({ id, data }: EditorResult<Data>) {
                const item = data.items.find(item => item.id === id);
                if (!item?.descriptionStyle) {
                  setFormItemProps({ data, id }, 'descriptionStyle', {
                    whiteSpace: 'pre-wrap',
                    lineHeight: '12px',
                    letterSpacing: '0px',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.45)',
                    fontStyle: 'normal',
                  });
                }
                return item?.descriptionStyle;
              },
              set({ id, data }: EditorResult<Data>, value: any) {
                const { styleEditorUnfold, ...style } = value;
                setFormItemProps({ data, id }, 'descriptionStyle', style);
              },
            },
          },
          {
            title: '提示语样式应用所有表单项',
            type: 'Button',
            value: {
              set({ id, data }: EditorResult<Data>) {
                const item = data.items.find(item => item.id === id)
                const descriptionStyle = item?.descriptionStyle || {
                  whiteSpace: 'pre-wrap',
                  lineHeight: '12px',
                  letterSpacing: '0px',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.45)',
                  fontStyle: 'normal',
                };
                data.items.forEach(item => item.descriptionStyle = descriptionStyle);
              }
            }
          },
        ]
      },
      {
        title: '必填样式',
        type: 'Switch',
        value: {
          get({ id, data }: EditorResult<Data>) {
            return getFormItemProp({ data, id }, 'required');
          },
          set({ id, data }: EditorResult<Data>, value) {
            setFormItemProps({ data, id }, 'required', value);
          }
        }
      },
    ]
  },
  '[data-form-actions]': ({ data, output }: EditorResult<Data>, cate1) => {
    cate1.items = [actionsEditor(data, output)];
  },
  '[data-form-actions-item]': {
    title: '操作',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string
            return data.actions.items.find(item => item.key === comId)?.visible
          },
          set({ data, focusArea, output }: EditorResult<Data>, val) {

            const comId = focusArea.dataset['formActionsItem']
            const item = data.actions.items.find(item => item.key === comId)
            if (item) {
              item.visible = val
            }
          }
        }
      },
      {
        title: '标题',
        type: 'text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string
            return comId && data.actions.items.find(item => item.key === comId)?.title
          },
          set({ data, focusArea, output }: EditorResult<Data>, val) {
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
        title: '风格',
        type: 'Select',
        options() {
          return [
            { value: 'primary', label: '主按钮' },
            { value: 'default', label: '次按钮' },
            { value: 'dashed', label: '虚线按钮' },
            { value: 'link', label: '链接按钮' },
            { value: 'text', label: '文字按钮' }
          ];
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string

            return data.actions.items.find(item => item.key === comId)?.type || 'default'
          },
          set({ data, focusArea }: EditorResult<Data>, value: ButtonType) {
            const comId = focusArea.dataset['formActionsItem']
            const item = data.actions.items.find(item => item.key === comId)

            if (item) {
              item.type = value
            }
          }
        }
      },
      {
        title: '危险按钮',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const comId = focusArea.dataset.formActionsItem as string

            return data.actions.items.find(item => item.key === comId)?.danger
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            const comId = focusArea.dataset['formActionsItem']
            const item = data.actions.items.find(item => item.key === comId)

            if (item) {
              item.danger = value
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
            options({ data, focusArea }) {
              const comId = focusArea.dataset['formActionsItem']
              const item = data.actions.items.find(item => item.key === comId)
              if (!item) return

              return {
                outputId: item.outputId
              }
            }
          }
        ]
      },
      {
        title: '删除',
        type: 'Button',
        ifVisible({ data, focusArea }) {
          const actions = data.actions.items
          const itemId = focusArea.dataset['formActionsItem']
          const item = actions.find(item => item.key === itemId)

          return item && !item?.isDefault
        },
        value: {
          set({ data, output, focusArea }: EditorResult<Data>) {
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
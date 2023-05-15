import { message } from 'antd'
import { Data, FormItemColonType, LabelWidthType, FormItems } from '../types'
import { ButtonType } from 'antd/es/button/button'
import { actionsEditor } from './actions'
import { SlotIds } from '../constants'
import { refreshSchema } from '../schema'
import { RuleKeys } from '../../../form-coms/utils/validator'

const defaultRules = [
  {
    key: RuleKeys.REQUIRED,
    status: false,
    visible: true,
    title: '必填',
    message: '请至少添加一项'
  },
  {
    key: RuleKeys.CODE_VALIDATOR,
    status: false,
    visible: true,
    title: '代码校验',
    validateCode: `export default async function (value, context) {
  if (!value) {
    // 校验失败
    context.failed('代码校验失败');
  } else {
    // 校验成功
    context.successed();
  }
}        
    `
  }
]

function fieldNameCheck(data: Data, name: string) {
  const fieldNameList = data.items.map(item => item.name)
  if (fieldNameList.includes(name)) {
    return true
  } else {
    return false
  }
}

function setSlotLayout(slot, val) {
  if (val.position === 'absolute') {
    slot.setLayout(val.position);
  } else if (val.display === 'flex') {
    if (val.flexDirection === 'row') {
      slot.setLayout('flex-row');
    } else if (val.flexDirection === 'column') {
      slot.setLayout('flex-column');
    }
  }
};

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
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  '@childAdd'({ data, inputs, outputs, slots }: EditorResult<Data>, child, curSlot) {
    if (curSlot.id === SlotIds.FormItems) {
      const { id, inputDefs, outputDefs, name } = child
      const item = data.items.find(item => item.id === id)
      const com = outputDefs.find(item => item.id === 'returnValue')

      if (item) {
        item.schema = com.schema
      } else {
        data.nameCount++;
        data.items.push({
          id,
          schema: com.schema,
          comName: name,
          name: `name${data.nameCount}`,
          label: `${data.nameCount}`,
          widthOption: 'span',
          span: 24 / data.formItemColumn,
          colon: 'default',
          labelAlign: 'default',
          labelAutoWrap: 'default',
          hiddenLabel: true,
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
    }
  },
  '@childRemove'({ data, inputs, outputs, logs, slots }, { id, name, title }) {
    // console.log('@childRemove', id, title)
    data.items = data.items.filter(item => item?.comName !== name)
    refreshSchema({ data, inputs, outputs, slots })
  },
  '@parentUpdated'({ id, data, parent }, { schema }) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      // parent['@_setFormItem']({id, schema: { type: 'object', properties: {} }})
      data.isFormItem = true
    } else {
      data.isFormItem = false
    }
  },
  ':root': ({ data, output }: EditorResult<Data>, cate1) => {
    cate1.items = [
      {
        title: '布局',
        items: [
          // {
          //   title: '排列方式',
          //   type: 'layout',
          //   options: [],
          //   value: {
          //     get({ data, slots }: EditorResult<Data>) {
          //       const { slotStyle = {} } = data;
          //       const slotInstance = slots.get(SlotIds.FormItems);
          //       setSlotLayout(slotInstance, slotStyle);
          //       return slotStyle;
          //     },
          //     set({ data, slots }: EditorResult<Data>, val: any) {
          //       if (!data.slotStyle) {
          //         data.slotStyle = {};
          //       }
          //       data.slotStyle = {
          //         ...data.slotStyle,
          //         ...val
          //       };
          //       const slotInstance = slots.get(SlotIds.FormItems);
          //       setSlotLayout(slotInstance, val);
          //     }
          //   }
          // },
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
      // {
      //   title: '标题',
      //   items: [
      //     {
      //       title: '宽度类型',
      //       type: 'Select',
      //       options: [
      //         { label: '固定像素', value: 'px' },
      //         { label: '24 栅格', value: 'span' },
      //       ],
      //       value: {
      //         get({ data }: EditorResult<Data>) {
      //           return data.labelWidthType
      //         },
      //         set({ data }: EditorResult<Data>, value: LabelWidthType) {
      //           data.labelWidthType = value
      //         },
      //       }
      //     },
      //     {
      //       title: '标题宽度(px)',
      //       type: 'inputNumber',
      //       options: [{ min: 1 }],
      //       ifVisible({ data }: EditorResult<Data>) {
      //         return data.labelWidthType === 'px'
      //       },
      //       value: {
      //         get({ data }: EditorResult<Data>) {
      //           return [data.labelWidth]
      //         },
      //         set({ data }: EditorResult<Data>, value: number) {
      //           data.labelWidth = value[0]
      //         }
      //       }
      //     },
      //     {
      //       title: '标题宽度(栅格)',
      //       type: 'Slider',
      //       options: [{ max: 24, min: 1, steps: 1, formatter: '格' }],
      //       ifVisible({ data }: EditorResult<Data>) {
      //         return data.labelWidthType === 'span'
      //       },
      //       value: {
      //         get({ data }: EditorResult<Data>) {
      //           return data.labelCol
      //         },
      //         set({ data }: EditorResult<Data>, value: number) {
      //           data.labelCol = value
      //         }
      //       }
      //     },
      //     {
      //       title: '显示冒号',
      //       type: 'Switch',
      //       value: {
      //         get({ data }: EditorResult<Data>) {
      //           return data.formItemConfig?.colon || data.colon
      //         },
      //         set({ data }: EditorResult<Data>, value: boolean) {
      //           data.formItemConfig.colon = value
      //         },
      //       }
      //     },
      //     {
      //       title: '自动换行',
      //       type: 'Switch',
      //       value: {
      //         get({ data }: EditorResult<Data>) {
      //           return data.formItemConfig?.labelWrap
      //         },
      //         set({ data }: EditorResult<Data>, value: boolean) {
      //           data.formItemConfig.labelWrap = value
      //         },
      //       }
      //     },
      //     {
      //       title: '对齐方式',
      //       type: 'Radio',
      //       options: [
      //         { label: '左对齐', value: 'left' },
      //         { label: '右对齐', value: 'right' }
      //       ],
      //       value: {
      //         get({ data }: EditorResult<Data>) {
      //           return data.formItemConfig?.labelAlign
      //         },
      //         set({ data }: EditorResult<Data>, value: 'left' | 'right') {
      //           data.formItemConfig.labelAlign = value
      //         },
      //       }
      //     },
      //   ]
      // },
      // {
      //   title: '初始长度',
      //   type: 'Slider',
      //   options: [{ min: 0, steps: 1 }],
      //   description: '动态列表的初始项数',
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.initLength;
      //     },
      //     set({ data }: EditorResult<Data>, val: number) {
      //       data.initLength = val;
      //     }
      //   }
      // },
      {
        title: '添加表单项',
        type: 'comSelector',
        options: {
          schema: 'mybricks.normal-pc.form-container/*',
          type: 'add'
        },
        value: {
          set({ data, slot }: EditorResult<Data>, namespace: string) {
            slot
              .get(SlotIds.FormItems)
              .addCom(namespace, false, { deletable: true, movable: true });
          }
        }
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
      //       return data.disabled
      //     },
      //     set({ data }: EditorResult<Data>, val: boolean) {
      //       data.disabled = val
      //       if (val) {
      //         data.currentAction = InputIds.SetDisabled;
      //       }
      //       else {
      //         data.currentAction = InputIds.SetEnabled;
      //       }
      //     }
      //   }
      // },
      {
        title: '校验规则',
        description: '提供快捷校验配置，需要配合表单容器使用生效',
        type: 'ArrayCheckbox',
        options: {
          checkField: 'status',
          visibleField: 'visible',
          getTitle: ({ title }: any) => {
            return title;
          },
          items: [
            {
              title: '提示文字',
              type: 'Text',
              value: 'message',
              ifVisible(item: any, index: number) {
                return item.key === RuleKeys.REQUIRED;
              }
            },
            {
              title: '编辑校验规则',
              type: 'code',
              options: {
                language: 'javascript',
                enableFullscreen: false,
                title: '编辑校验规则',
                width: 600,
                minimap: {
                  enabled: false
                },
                babel: true,
                eslint: {
                  parserOptions: {
                    ecmaVersion: '2020',
                    sourceType: 'module'
                  }
                }
              },
              ifVisible(item: any, index: number) {
                return item.key === RuleKeys.CODE_VALIDATOR;
              },
              value: 'validateCode'
            }
          ]
        },
        value: {
          get({ data }) {
            return data.rules?.length > 0 ? data.rules : defaultRules;
          },
          set({ data }, value: any) {
            data.rules = value;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '初始化',
            type: '_event',
            options: {
              outputId: 'onInitial'
            }
          },
          {
            title: '值更新',
            type: '_event',
            options: {
              outputId: 'onChange'
            }
          }
        ]
      }
    ]
  },
  ':child(mybricks.normal-pc.form-container/form-item)': {
    title: '表单项',
    items: [
      {
        title: '显示标题',
        type: 'Switch',
        value: {
          get({ id, data }: EditorResult<Data>) {
            return !getFormItemProp({ data, id }, 'hiddenLabel');
          },
          set({ id, data }: EditorResult<Data>, val) {
            setFormItemProps({ data, id }, 'hiddenLabel', !val);
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
          set({ id, data, slot }: EditorResult<Data>, val) {
            const item = data.items.find(item => item.id === id)
            if (item) {
              item['label'] = val
              // setFormItemProps({ data, id }, 'label', val);
            }
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
          }
        ]
      },
    ]
  },
  '[data-form-actions]': {
    title: '操作区',
    items: ({ data, output }: EditorResult<Data>, cate1) => {
      cate1.title = '操作区';
      cate1.items = actionsEditor(data, output);
    }
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
                outputId: item.outputId,
                // slotId: SlotIds.FormItems
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
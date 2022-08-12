import { Tooltip, message } from 'antd'
import { observe } from '@mybricks/rxui'
import React from 'react'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { FormListFieldData, FormListOperation } from 'antd/es/form/FormList'
import { FormInstance } from 'antd/es/form'
import { FormItemProps, FormContext } from '../runtime'
import style from '../runtime.less'

interface FieldAddonProps {
  field: FormListFieldData
  actions: FormListOperation
  formRef: React.MutableRefObject<FormInstance | null | undefined>
  formItem: FormItemProps
  fieldIndex: number
  name: string
}

export default function FormFieldAddon({ field, actions, formRef, name, formItem, fieldIndex }: FieldAddonProps) {
  const formContext = observe(FormContext, { from: 'parents' })
  let disabled: boolean | undefined = false
  formItem.fieldsFormItems.forEach(item => {
    disabled = item.fieldsConfig && item.fieldsConfig[field.fieldKey].disabled
  })
  return (
    <div>
      {
        formItem.fieldsActions && formItem.fieldsActions.map((item: string) => {
          if (item === 'copy') {
            return (
              <Tooltip key={item} placement="top" title="复制">
                <CopyOutlined
                  style={{ margin: '0 12px' }}
                  onClick={() => {
                    let option
                    let value = formRef.current?.getFieldValue(name)
                    const fieldsFormItem = formItem.fieldsFormItems[0]
                    if (fieldsFormItem.type === 'select' && value[field.name]) {
                      option = fieldsFormItem.options.find(item => item.value === value[field.name][fieldsFormItem.name])
                    }
                    if (formItem.copyOutputId && option) {
                      formContext.outputs[formItem.copyOutputId](option)
                    }

                    // // let option
                    // let value = formRef.current?.getFieldValue(name)
                    // // const fieldsFormItem = formItem.fieldsFormItems[0]

                    // // if (fieldsFormItem.type === 'select') {
                    // //   option = fieldsFormItem.options.find(item => item.value === value[field.name][fieldsFormItem.name])
                    // // }

                    // value = value[field.name]

                    // // if (option) {
                    // //   value = option.label
                    // // }
                    // if (formItem.copyOutputId) {
                    //   formContext.outputs[formItem.copyOutputId](value)
                    // }
                    // // console.log(value)
                    // // copyText(value)
                  }}
                />
              </Tooltip>
            )
          }
        })
      }
      {
        !formItem.disabled && fieldIndex !== 0 && !disabled &&(
          <Tooltip overlayClassName={style.formTooltip} placement="top" title="删除" >
            <DeleteOutlined
              style={{ margin: '0 12px' }}
              onClick={() => {
                actions.remove(field.name)
              }}
            />
          </Tooltip>
        )
      }
    </div>
  )
}

function copyText(value: string) {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.value = value
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  message.success('已复制到剪贴板')
}
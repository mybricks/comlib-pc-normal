import { useComputed } from '@mybricks/rxui'
import { FormItemContext } from './index'
import { FormContext } from '../runtime'
import { Form, Space } from 'antd'
import React, { useCallback, Fragment } from 'react'
import { FormListFieldData, FormListOperation } from 'antd/es/form/FormList'
import { getLabelCol } from '../utils'
import FormControlFactory from '../form-control/formControlFactory'
import FormFieldAddon from '../form-actions/formFieldAddon'
import LabelTooltip from '../components/LabelTooltip'

interface DynamicFieldsProps {
  fields: FormListFieldData[]
  operation: FormListOperation
  formContext: FormContext
  formItemContext: FormItemContext
  data: any
}

export default function DynamicFields ({ data, fields, operation, formContext, formItemContext }: DynamicFieldsProps) {
  const formItem = formItemContext.formItem
  const formItemIndex = formItemContext.index
  const labelWidth = formContext.data.labelWidth ? formContext.data.labelWidth : 98

  const descPosition = useComputed(() => {
    return formItemContext.formItem.descriptionPosition === 'top' 
      ? { display: 'flex', flexDirection: 'column-reverse' }
      : { display: 'flex' }
  })
  // const flexLabelWidth =  `0 0 ${labelWidth}px`
  const fieldsFormItems = useCallback((field: FormListFieldData, fieldIndex: number) => {
    return formItem.fieldsFormItems.map((fieldsFormItem, fieldsFormItemIndex) => {
      let showMark = true
      if (formItemContext.formItem.dynamicdItemDscriptionShowProgram === 'first') {
        showMark = fieldIndex === 0
      }

      if (typeof fieldsFormItem.fieldsConfig === 'undefined') {
        fieldsFormItem.fieldsConfig = { [field.fieldKey]: { options: void 0, disabled: false } }
      } else if (typeof fieldsFormItem.fieldsConfig[field.fieldKey] === 'undefined') {
        fieldsFormItem.fieldsConfig[field.fieldKey] = { options: void 0, disabled: false }
      }

      return (
        <Form.Item
          data-item-type="dynamicFormItem"
          data-form-item-index={formItemIndex}
          data-field-item-index={fieldsFormItemIndex}
          style={{ marginBottom: 0 }}
          key={fieldsFormItem.key}>
          <Space style={descPosition} align="baseline">
            <FormControlFactory data={data} formItem={fieldsFormItem} field={field} isDynamic={true}/>
            {
              fieldsFormItem.mark && showMark
                && (
                  <span>
                    {fieldsFormItem.mark}
                  </span>
                )
            }
          </Space>
        </Form.Item>
      )
    })
  }, [formItem.fieldsFormItems, formItemContext.formItem.descriptionPosition])

  return (
    <Fragment>
      {
        fields.map((field, fieldIndex) => {
          let label = fieldIndex === 0 ? formItem.label : void 0
          let marginLeft = fieldIndex === 0 ? void 0 : `${labelWidth}px` 
          let wrapperCol = fieldIndex === 0 ? { span: formContext.data.wrapperCol } : void 0
          const labelCol = fieldIndex === 0 && formContext.data.layout === 'horizontal' ? getLabelCol(formContext.data) : void 0

          if (formItem.dynamicItemLabelShowType === 'index') {
            label = `${formItem.label}${fieldIndex + 1}`
            wrapperCol = { span: formContext.data.wrapperCol }
            marginLeft = void 0
          }

          if (!formContext.data.showLabel) {
            label = void 0
            marginLeft = void 0
          }

          if (formContext.data.layout === 'vertical') {
            marginLeft = void 0
          }

          const labelContent = formItem.tooltip ? <LabelTooltip /> : label

          return (
            <Form.Item
              data-item-dynamic={fieldIndex}
              data-form-item-index={formItemIndex}
              style={{ 
                marginBottom: formContext.data.intervalMargin, 
                marginLeft
              }}
              label={label ? labelContent : void 0}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              required={formItem.isRequired || formItem.isNewRequired}
              key={field.key}>
              <div style={{ display: 'flex' }}>
                <Space style={{ display: 'flex' }} align="start">
                  {fieldsFormItems(field, fieldIndex)}
                </Space>
                <Space style={{ display: 'flex' }} align="center">
                  <FormFieldAddon
                    formRef={formContext.formRef}
                    formItem={formItem}
                    name={formItem.name}
                    field={field}
                    fieldIndex={fieldIndex}
                    actions={operation}
                  />
                </Space>
              </div>
            </Form.Item>
          )
        })
      }
    </Fragment>
  )
}
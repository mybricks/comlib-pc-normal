import React from 'react'
import { Form } from 'antd'
import { observe } from '@mybricks/rxui'
import { FormContext } from '../runtime'
import { FormItemContext } from './index'
import { getWrapperCol } from '../utils'

export default function SlotItem () {
  const formContext = observe(FormContext, {from: 'parents'})
  const formItemContext = observe(FormItemContext, {from: 'parents'})
  const formItem = formItemContext.formItem
  
  const wrapperCol = formContext.data.layout === 'horizontal'
    ? { span: formContext.data.wrapperCol }
    : void 0

  let marginLeft = 0;

  if (!formContext.data.showLabel) {
    marginLeft = void 0
  }

  // 添加fieldName用于监听其他数据变化
  const addFormItem = (fieldName: string | string[]) => {
    const formItems = formContext.data.formItems;
    if (typeof fieldName === 'string' && !formItems.some(item => item.name === fieldName)) {
      const defaultFormItem: any = {
        name: fieldName,
        type: 'customSlotItem'
      };
      formItems.push(defaultFormItem)
    }
    if (Array.isArray(fieldName)) {
      fieldName.forEach(addFormItem);
    }
  }

  const SlotFormItem = formItemContext.formItem?.slotId && formContext.slots[formItemContext.formItem?.slotId]?.render;
  return (
    <Form.Item
      wrapperCol={formContext.data.labelWidthType === 'span' ? getWrapperCol(formContext.data) : wrapperCol}
      style={{
        marginBottom: formContext.data.intervalMargin,
        marginLeft: formContext.data.labelWidthType === 'span' ? void 0 : marginLeft
      }}
      // label={formContext.data.showLabel ? formItem.label : void 0}
      required={formItem.isRequired && !formItem.disabled}>
      {SlotFormItem && <SlotFormItem
        inputs={{
          install(fn) {
            (formItem as any).fn = () => {
              fn({
                formItems: formContext.data.formItems,
                addFormItem: addFormItem,
                formRef: formContext.formRef.current
              })
            }
            (formItem as any).fn();
          }
        }}
        outputs={{
          onChange(val) {
            formContext.formRef.current?.setFieldsValue(val);
          }
        }}
      />}
    </Form.Item>
  )
}
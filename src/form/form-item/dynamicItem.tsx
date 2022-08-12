import React, { Fragment } from 'react'
import { Form, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FormContext } from '../runtime'
import { observe, useComputed } from '@mybricks/rxui'
import { FormItemContext } from './index'
import { getWrapperCol } from '../utils'
import DynamicFields from './dynamicFields'
import css from '../runtime.less'

export default function DynamicItem ({data}) {
  const formContext = observe(FormContext, {from: 'parents'})
  const formItemContext = observe(FormItemContext, {from: 'parents'})
  const formItem = formItemContext.formItem
  const timeIds = {}
  let labelWidth: string | undefined = `${formContext.data.labelWidth ? formContext.data.labelWidth : 98}px`

  if (!formContext.data.showLabel) {
    labelWidth = void 0
  }

  if (formContext.data.layout === 'vertical') {
    labelWidth = void 0
  }

  const addButtonLabel = useComputed(() => {
    return formItem.dynamicItemAction?.title || `添加${formItem.label}`
  })

  const addButtonType = useComputed(() => {
    return formItem.dynamicItemAction?.type
  })

  const wrapperCol = useComputed(() => {
    if (formContext.data.labelWidthType !== 'span') {
      return void 0
    }
    
    return getWrapperCol(formContext.data)
  })

  return (
    <Form.List name={formItem.name}>
      {(fields, { add, remove, move }) => {
        let showButton = true

        if (!timeIds[formItem.name]) {
          timeIds[formItem.name] = setTimeout(() => {
            const value = formContext.formRef.current?.getFieldValue(formItem.name)
            if (fields.length <= 0 && (!formItem.disabled || formContext.env.edit) && !value) {
              clearTimeout(timeIds[formItem.name])
              add()
            }
            timeIds[formItem.name] = null
          }, 0)
        }

        if (formItem.dynamicItemLength && fields.length >= formItem.dynamicItemLength) {
          showButton = false
        } else {
          showButton = true
        }

        return (
          <Fragment>
            <DynamicFields
              data={data}
              fields={fields}
              formContext={formContext}
              formItemContext={formItemContext}
              operation={{ add, remove, move }}
            />
            {
              showButton && (
                <Form.Item
                  style={{
                    marginBottom: formContext.data.intervalMargin,
                    marginLeft: formContext.data.labelWidthType !== 'span' ? labelWidth : void 0
                  }}
                  wrapperCol={wrapperCol}
                >
                  <Button
                    data-form-item-type="dynamicItemAction"
                    data-form-item-index={formItemContext.index}
                    type={addButtonType}
                    disabled={formItem.disabled}
                    onClick={() => {
                      if (!formContext.env.runtime) return
                      add()
                    }}>
                    <PlusOutlined />
                    {addButtonLabel}
                  </Button>

                  {formItem.description && (
                    <div className={css.formItemDesc}>
                      <Form.Item style={{ marginBottom: 0}} noStyle>
                        <span style={{color: formItem.descriptionColor || ''}}>{formItem.description}</span>
                      </Form.Item>
                    </div>
                  )}
                </Form.Item>
              )
            }
          </Fragment>
        )
      }}
    </Form.List>
  )
}
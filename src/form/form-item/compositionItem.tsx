import React, { useCallback } from 'react'
import css from '../runtime.less'
import { Form, Space } from 'antd'
import { observe, useComputed } from '@mybricks/rxui'
import { FormContext } from '../runtime'
import { FormItemContext } from './index'
import FormControlFactory from '../form-control/formControlFactory'
import LabelTooltip from '../components/LabelTooltip'

export default function CompositionItem ({data}) {
  const formContext = observe(FormContext, {from: 'parents'})
  const formItemContext = observe(FormItemContext, {from: 'parents'})
  const formItem = formItemContext.formItem
  const labelContent = useComputed(() => {
    return formItem.tooltip ? <LabelTooltip /> : formItem.label
  })

  const itemClassName = useCallback(() => {
    let className = `${css['composition-item']} ${css['composition-item-inline']}`
    if (formItemContext.formItem.descriptionPosition === 'top' ) {
      className = `${css['composition-item']} ${css['composition-item-inline']} ${css['composition-item-inline__column']}`
    }
    return className
  }, [formItemContext.formItem.descriptionPosition])

  const compositionItems = useComputed(() => {
    return formItemContext.formItem.compositionItems?.map((compositionItem, index) => {
      if (typeof compositionItem.visible !== 'undefined' && !compositionItem.visible) return
      
      return (
        <div
          data-item-type="compositionItem"
          data-form-item-type={formItemContext.formItem.type}
          data-form-item-index={formItemContext.index}
          data-form-composition-item-index={index}
          key={compositionItem.key}>
          <div className={`${itemClassName()} ${css.inputWrap}`}>
            {
              compositionItem.preCopy
                && (
                <span style={{ color: compositionItem.descriptionColor || '' }} className={css.preCopy}>
                    {compositionItem.preCopy}
                  </span>
                )
              }
            <FormControlFactory
              data={data}
              isComposition={true}
              formItem={compositionItem}
              fieldName={[formItem.name, compositionItem.name]}
            />
             {
                compositionItem.postCopy 
                  && (
                  <span style={{ color: compositionItem.descriptionColor || '' }} className={css.postCopy}>
                      {compositionItem.postCopy}
                    </span>
                  )
              }
            {
              compositionItem.description
                && (
                  <span style={ formContext.data.layoutModel !== 'inline' ? { marginLeft: '16px'} : void 0 }>
                    {compositionItem.description}
                  </span>
                )
            }
          </div>
        </div>
      )
    })
  })

  return (
    <Form.Item
      style={{ marginBottom: formContext.data.intervalMargin }}
      label={formContext.data.showLabel ? labelContent : void 0}
      required={(formItem.isRequired || formItem.isNewRequired) && !formItem.disabled}
    >
      <div
        data-item-type="composition"
        data-form-item-index={formItemContext.index}
        style={{ display: 'flex' }}>
        <Space style={{ display: "flex" }} align="start" size="middle">
          { compositionItems }
        </Space>
      </div>
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
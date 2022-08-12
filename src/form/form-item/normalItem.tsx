import React, { useCallback, useMemo } from 'react'
import css from '../runtime.less'
import { Button, Form } from 'antd'
import { FormContext } from '../runtime'
import { observe, useComputed } from '@mybricks/rxui'
import { FormItemContext } from './index'
import FormControlFactory from '../form-control/formControlFactory'
import LabelTooltip from '../components/LabelTooltip'

export default function NormalItem ({data, env, outputs}) {
  const formContext = observe(FormContext, {from: 'parents'})
  const formItemContext = observe(FormItemContext, {from: 'parents'})
  const formItem = formItemContext.formItem
  const labelContent = useComputed(() => {
    return formItem.tooltip ? <LabelTooltip /> : formItem.label
  })

  const getLabel = () => {
    if (formContext.data.showLabel) {
      if (formItem.showLabel || formItem.showLabel == void 0) {
        return <span style={formItem.titleStyle ? {...formItem.titleStyle} : {}}>{labelContent}</span>
      }
      if (formItem.showLabel === false) return ' '
    }
    if (formItem.showLabel) return labelContent
    return void 0
  }

  const getColon = () => {
    if (formContext.data.colon) {
      if (formItem.showLabel || formItem.showLabel === void 0) return true
      return formItem.showLabel
    }
    return false
  }

  const btnClick = useCallback((item) => {
    if (env.runtime) {
      outputs[item.id](0)
    }
  }, [])

  const customMargin = formItem.cusMargin
  const marginTop = customMargin ? customMargin[0] : 0
  const marginBottom = customMargin ? customMargin[1] : formContext.data.intervalMargin
  const marginLeft = customMargin ? customMargin[2] : 0
  const marginRight = customMargin ? customMargin[3] : (formContext.data.layout === 'inline' ? 16 : 0)

  return (
    <Form.Item
      validateStatus={formItem.validateStatus as any}
      hasFeedback={formItem.hasFeedback}
      hidden={formItem.hidden}
      colon={getColon()}
      style={{ marginTop, marginBottom, marginLeft, marginRight }}
      label={getLabel()}
      className={css.formWrap}
      required={((formItem.isRequired || formItem.isNewRequired) && !formItem.hideRequiredStyle) && !formItem.disabled || typeof formItem.disabled !== 'boolean'}
    >
      <div className={css.inputWrap}>
        {formItem.preCopy && <span className={css.preCopy}>{formItem.preCopy}</span>}
        <FormControlFactory data={data} formItem={formItem} index={formItemContext.index} />
        {
          formItem.showTailBtn ? formItem.tailBtns?.map((item) => {
            const {title, btnType, id, idx} = item
            return (
              <div key={id} data-btn-id={id} data-btn-idx={idx}  style={{padding: '2px'}}>
                <Button type={btnType} onClick={() => btnClick(item)} >{title}</Button>
              </div>
            )
          }) : null
        } 
        {formItem.postCopy && <span className={css.postCopy}>{formItem.postCopy}</span>}
      </div>
      {formItem.description && (
        <div className={css.formItemDesc}>
          <Form.Item style={{ marginBottom: 0 }} noStyle>
            <span style={{color: formItem.descriptionColor || ''}}>{formItem.description}</span>
          </Form.Item>
        </div>
      )}
    </Form.Item>
  )
}
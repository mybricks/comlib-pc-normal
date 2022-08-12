import React, { useCallback } from 'react'
import { observe } from '@mybricks/rxui'
import { FormContext, resetForm } from '../runtime'
import { Button, Col, Form, Space } from 'antd'
import { getWrapperCol } from '../utils'

export default function FormActions ({env}: {env?:any}) {
  const formContext = observe(FormContext, { from: 'parents' })
  const spanCount = formContext.data.formItems.reduce((acc, cur) => {
    const span = cur.span ? cur.span : ~~(24 / formContext.data.columnCount).toFixed(0)
    return acc + span
  }, 0)
  const isLayoutVertical = formContext.data.layout === 'vertical'
  const isLayoutHorizontal = formContext.data.layout === 'horizontal'
  let actionsConfig = formContext.data.actionsConfig

  let span = ~~(24 / formContext.data.columnCount).toFixed(0)
  let offset = (24 - spanCount % 24) >= span ? 24 - span - spanCount % 24 : 24 - span

  const wrapperCol = isLayoutHorizontal ? { span: formContext.data.wrapperCol } : void 0
  
  let marginLeft = isLayoutHorizontal ? `${formContext.data.labelWidth ? formContext.data.labelWidth : 98}px` : void 0

  if (!formContext.data.isFollow) {
    span = 24
    offset = 0
  }

  if (formContext.data.actionPosition === 'default') {
    offset = 0
  }

  if (!formContext.data.showLabel) {
    marginLeft = void 0
  }

  if (typeof actionsConfig === 'undefined') { // 兼容代码
    actionsConfig = { useLabelWidth: true, span: void 0 }
  }

  const onCancel = useCallback(() => {
    formContext.outputs['cancel']()
  }, [])

  const onReset = useCallback(()=>{
    resetForm(formContext.data)
    formContext.outputs['reset']()
    formContext.outputs['afterReset'](true)
  }, [])

  if(!formContext.data.resetBtn){
    formContext.data.resetBtn = {
      text: "重置",
      isVisible: false
    }
  }
 
  function ActionsBtn () {
    return (
      <Space>
        <Button data-item-type="submitBtn" type="primary" htmlType="submit" loading={formContext.isLoading}>{formContext.data.primaryBtnText}</Button>
        {
          formContext.data.showSecondBtn
          && <Button data-item-type="secondBtn" onClick={onCancel}>{formContext.data.secondBtnText}</Button>
        }
        {
          formContext.data.resetBtn?.isVisible
          && <Button data-item-type="resetBtn" onClick={onReset} danger>{formContext.data.resetBtn.text}</Button>
        }
      </Space>
    )
  }

  if (formContext.data.layoutModel === 'inline') {
    return (
      <Form.Item wrapperCol={{ span: 24 }} data-item-type="formActions">
        <Space style={{ marginBottom: formContext.data.intervalMargin }}>
          <ActionsBtn />
        </Space>
      </Form.Item>
    )
  }

  return (
    <Col
      style={{ textAlign: formContext.data.actionAlign }}
      span={span}
      offset={actionsConfig?.useLabelWidth ? (isLayoutVertical ?  void 0 : offset) : void 0}
      data-item-type="formActions"
    >
      <Form.Item
        wrapperCol={formContext.data.labelWidthType === 'span' ? getWrapperCol(formContext.data) : wrapperCol}
        style={{
          marginBottom: formContext.data.intervalMargin,
          marginLeft: actionsConfig?.useLabelWidth ? (formContext.data.labelWidthType === 'span' ? void 0 : marginLeft) : void 0,
        }}
      >
        <Space
          align={isLayoutVertical ? 'center' : void 0}
          style={isLayoutVertical ? { paddingTop: '30px' } : void 0}>
          <ActionsBtn />
        </Space>
      </Form.Item>
    </Col>
  )
}
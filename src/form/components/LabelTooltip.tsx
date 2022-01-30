import React, { Fragment } from 'react'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { FormItemContext } from '../form-item'
import { observe } from '@mybricks/rxui'
import css from '../runtime.less'

export default function LabelTooltip () {
  const formItemContext = observe(FormItemContext, {from: 'parents'})

  return (
    <Fragment>
      {formItemContext.formItem.label}
      <Tooltip className={css['form-item-tooltip']} placement="top" title={formItemContext.formItem.tooltip}>
        <InfoCircleOutlined />
      </Tooltip>
    </Fragment>
  )
}
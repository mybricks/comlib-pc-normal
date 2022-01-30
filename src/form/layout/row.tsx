import React, { Fragment } from 'react'
import css from '../runtime.less'
import { FormContext } from '../runtime'
import { Row, Col } from 'antd'
import { observe } from '@mybricks/rxui'
import FormItem from '../form-item'
import FormActions from '../form-actions/formActions'
import Group from '../form-item/group';

export default function RowLayout ({data, env, outputs}) {
  const formContext = observe(FormContext, {from: 'parents'})
  const actionsConfig = formContext.data.actionsConfig

  return (
    <Fragment>
      <Row className={css.formItemsWarpper}>
        {formContext.data.formItems.map((formItem, index) => {
          if (formItem.type === 'customSlotItem') return;
          if (formItem.type === 'group') return (
            <Col
              data-item-type="formItem"
              data-item-index={index}
              key={formItem.key}
              span={24}
            >
              <Group formItem={formItem} index={index}/>
            </Col>
          )
          if (typeof formItem.visible !== 'undefined' && !formItem.visible) return

          const span = formItem.span ? formItem.span : ~~(24 / formContext.data.columnCount).toFixed(0)

          return (
            <Col
              data-item-type="formItem"
              data-item-index={index}
              key={formItem.key}
              span={span}>
              <FormItem data={data} formItem={formItem} index={index} env={env} outputs={outputs} />
            </Col>
          )
        })}
        {
          (typeof formContext.data.showActions === 'undefined' || formContext.data.showActions)
          ? (
            <Col span={actionsConfig?.span || 24}>
              <FormActions env={env} />
            </Col>
          )
          : null
        }
      </Row>
      {/* {
        (typeof formContext.data.showActions === 'undefined' || formContext.data.showActions)
        ? (
          // <Row style={{ flex: '1 1 100%' }}>
          //   <FormActions env={env} />
          // </Row>
          <Col span={formContext.data.actionsConfig?.span} ><FormActions env={env} /></Col>
        )
        : null
      } */}
    </Fragment>
  )
}
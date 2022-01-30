import React, { Fragment } from 'react'
import css from '../runtime.less'
import { FormContext } from '../runtime'
import { Row, Col } from 'antd'
import { observe } from '@mybricks/rxui'
import FormItem from '../form-item'
import FormActions from '../form-actions/formActions'
import Group from '../form-item/group';

export default function Column ({data, env, outputs}) {
  const formContext = observe(FormContext, {from: 'parents'})

  return (
    <Fragment>
      <Row className={css.formItemsWarpper} style={{ flexDirection: 'column' }}>
        {formContext.data.formItems.map((formItem, index) => {
          if (formItem.type === 'customSlotItem') return;
          if (typeof formItem.visible !== 'undefined' && !formItem.visible) return
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
          const span = formItem.span ? formItem.span : ~~(24 / formContext.data.columnCount).toFixed(0)

          return (
            <Col
              data-item-type="formItem"
              data-item-index={index}
              key={formItem.key}
              span={span}>
              <FormItem data={data} formItem={formItem} index={index} env={env} outputs={outputs}/>
            </Col>
          )
        })}
      </Row>
      {
        (typeof formContext.data.showActions === 'undefined' || formContext.data.showActions)
        ? (
          <Row style={{ flex: '1 1 100%' }}>
            <FormActions env={env} />
          </Row>
        )
        : null
      }
    </Fragment>
  )
}
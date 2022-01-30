import React from 'react'
import css from '../runtime.less'
import { FormContext } from '../runtime'
import { Col } from 'antd'
import { observe } from '@mybricks/rxui'
import FormItem from '../form-item'
import FormActions from '../form-actions/formActions'
import Group from '../form-item/group';

export default function Inline ({data, env, outputs}) {
  const formContext = observe(FormContext, {from: 'parents'})

  return (
    <div className={css['form-inline-content']}>
      {/* <div className={css['form-inline-content__left']}> */}
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
              <FormItem data={data} formItem={formItem} index={index} env={env} outputs={outputs} />
            </Col>
          )
        })}
      {/* </div> */}
      {/* <div className={css['form-inline-content__right']}> */}
        {
          (typeof formContext.data.showActions === 'undefined' || formContext.data.showActions)
            ? <Col span={formContext.data.actionsConfig?.span} ><FormActions env={env} /></Col>
          : null
        }
      {/* </div> */}
      
    </div>
  )
}
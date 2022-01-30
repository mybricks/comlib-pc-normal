import React from 'react'
import { FormItemProps } from '../runtime'
import { useComputed, useObservable } from '@mybricks/rxui'
import NormalItem from './normalItem'
import DynamicItem from './dynamicItem'
import CompositionItem from './compositionItem'
import SlotItem from './slotItem'
export class FormItemContext {
  formItem: FormItemProps
  index: number
  data: any
  env: any
  outputs
}

export default function FormItem ({ formItem, index, data, env, outputs }: FormItemContext) {
  const formItemContext = useObservable(FormItemContext, next => next({
    formItem,
    index
  }), { to: 'children' })

  // todo 暂定
  formItemContext.index = index

  const formItemEle = useComputed(() => {
    if (formItemContext.formItem.type === 'dynamicItem' ) {
      return <DynamicItem data={data}/>
    } else if (formItemContext.formItem.type === 'compositionItem') {
      return <CompositionItem data={data}/>
    } else if (formItemContext.formItem.type === 'slotItem') {
      return <SlotItem />
    } else {
      return <NormalItem data={data} env={env} outputs={outputs}/>
    }
  })

  return formItemEle
}
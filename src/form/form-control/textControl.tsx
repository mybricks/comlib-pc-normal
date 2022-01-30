import React from 'react'
// import { Option, FormItemProps } from '../runtime'
// import { observe } from '@mybricks/rxui'
// import { FormItemContext } from '../form-item'

interface TextControlProps {
  value?: string
  onChange?: (value: string) => void
}

export default function TextControl ({ value, onChange }: TextControlProps) {
  // const formItemContext = observe(FormItemContext, {from: 'parents'})
  
  return (
    <span>{value ? value : '[暂无数据]'}</span>
  )
}
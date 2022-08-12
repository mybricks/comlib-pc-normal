import React from 'react'
import { Transfer } from 'antd'
import { TransferItem } from 'antd/es/transfer'
import { observe } from '@mybricks/rxui'
import { FormItemContext } from '../form-item'

interface TransferControlProps {
  value?: TransferItem[]
  onChange?: (value: TransferItem[]) => void
}

export default function TransferControl ({ value, onChange }: TransferControlProps) {
  const formItemContext = observe(FormItemContext, {from: 'parents'})

  return (
    <Transfer dataSource={value}></Transfer>
  )
}
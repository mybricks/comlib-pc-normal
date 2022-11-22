import { TransferProps } from 'antd'
export type TransferItem = {
  key: string
  title: string
  description: string
  disabled?: boolean
}

export interface Data extends TransferProps<TransferItem> {
  disabled?: boolean
  showDesc?: boolean
  showPagination?: boolean
  rules: any[]
}
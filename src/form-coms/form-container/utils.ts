import { Data } from './types'
import { labelWidthTypes } from './constants'

export function getLabelCol (data: Data) {
  const labelCol = data.labelWidthType === labelWidthTypes.SPAN
    ? { span: 24 - data.wrapperCol }
    : { flex: `0 0 ${data.labelWidth ? data.labelWidth : 98}px` }

  return labelCol
}
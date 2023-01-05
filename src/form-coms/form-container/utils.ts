import { Data } from './types'
import { labelWidthTypes } from './constants'

export function getLabelCol (data: Data) {
  const labelCol = data.labelWidthType === labelWidthTypes.SPAN
    ? { span: data.labelCol }
    : { flex: `0 0 ${data.labelWidth ? data.labelWidth : 98}px` }

  return labelCol
}

export function isObject (val: any) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export function objectFilter(val: any) {
  Object.keys(val).forEach(key => {
    if ([undefined, null].includes(val[key])) {
      delete val[key]
    }
  })

  return val
}
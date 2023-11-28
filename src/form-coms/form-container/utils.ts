import { Data, FormItems, AdditionalItem } from './types'
import { labelWidthTypes } from './constants'
import { typeCheck } from '../../utils'

export function getLabelCol(data: Data) {
  const labelCol = data.labelWidthType === labelWidthTypes.SPAN
    ? { span: data.labelCol }
    : { flex: `0 0 ${data.labelWidth ? data.labelWidth : 98}px` }

  return labelCol
}

export function isObject(val: any) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export const getFormItem = (data: Data, com): { item: FormItems, isFormItem: true } | { item: AdditionalItem, isFormItem: false } => {
  const { items, additionalItems } = data;
  let item, isFormItem = false;

  // 查找表单项
  item = items.find((item) => {
    if (item.comName) {
      return item.comName === com.name
    }

    return item.id === com.id
  });
  if (item) return { item, isFormItem: true };

  // 查找非表单项
  item = additionalItems.find((item) => {
    if (item.comName) {
      return item.comName === com.name
    }
    return item.id === com.id
  });
  if (item) return { item, isFormItem: false };

  return { item, isFormItem };
}
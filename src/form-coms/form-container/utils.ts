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

/**
  * 设置表单项公共配置
  * @param formItemsProps 表单项配置对象
  */
export const setFormItemsProps = (formItemsProps: { string: FormItems }, { data, title }: { data: Data, title?: string }) => {
  if (typeCheck(formItemsProps, ['Object'])) {
    Object.entries(formItemsProps).map(([name, props]) => {
      if (!typeCheck(props, ['Object'])) {
        console.warn(`${title}: 设置表单项【${name}】配置不是对象类型`);
        return;
      }

      const formItemIndex = data.items.findIndex((item) => (item.name || item.label) === name);
      if (formItemIndex < 0) {
        console.warn(`${title}: 设置表单项配置【${name}】不存在`);
        return;
      }

      const formItem = data.items[formItemIndex];
      const newFormItem = { ...props };
      const { descriptionStyle = {}, labelStyle = {} } = formItem;
      const newLabelStyle = newFormItem.labelStyle || {};
      const newDescriptionStyle = newFormItem.descriptionStyle || {};

      const temp = {
        ...formItem,
        ...props,
        labelStyle: { ...labelStyle, ...newLabelStyle },
        descriptionStyle: { ...descriptionStyle, ...newDescriptionStyle },
      };
      data.items[formItemIndex] = temp;
    });
  }
};

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
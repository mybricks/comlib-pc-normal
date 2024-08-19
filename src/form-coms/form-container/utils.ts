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
  if(com.useDynamicItems) {
    item = items.find(item => {
      return item.comName +'::' + item.id === com.id
    })
    if(item) return { item, isFormItem: true}
  }
  item = items.find((item, idx) => {
    if (item.comName) {
      return item.comName === com.name && (com.index ? com.index === idx : true)
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

export const getFormItemById = (data: Data, com): { item: FormItems, isFormItem: true } | { item: AdditionalItem, isFormItem: false } => {
  const { items, additionalItems } = data;
  let item, isFormItem = false;

  // 查找表单项
  item = items.find((item) => {
    return item.id === com.id
  });
  if (item) return { item, isFormItem: true };

  if (item) return { item, isFormItem: false };

  return { item, isFormItem };
}


export function isDynamicChildrenStoreValid(data, childrenStore): boolean {
  const res = data.items.every(field => {
    const { name } = field;
    return childrenStore[name]
  });
  return res;
}

// 判断是否有数据源输入
export function getChildDataSource(child: any) {
  if (child.inputDefs?.length) {
    let found = child.inputDefs.find(
      (item) => item.title === '设置数据源' || item.id === 'setOptions'
    );
    if (found) {
      return found.schema;
    }
    return undefined;
  }
  return undefined;
}

/**
 * 获取表单项属性
 */
export function getFormItemProp(
  { data, ...com }: { data: Data; id: string; name: string },
  name: keyof FormItems
) {
  try {
    const { item } = getFormItem(data, { id: com.id, name: com.name });

    return item?.[name];
  } catch (e) {
    console.error(e);
  }
}

/** 
 * 设置表单项属性
 */
export function setFormItemProps(
  { data, ...com }: { data: Data; id: string; name: string },
  name: keyof FormItems,
  value: any
) {
  try {
    const { item } = getFormItem(data, { id: com.id, name: com.name }) || {};

    item[name] = value;
  } catch (e) {
    console.error(e);
  }
}
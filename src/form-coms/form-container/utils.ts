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

/** 获取设置列间距后的宽度 */
export function getAfterGapColWidth({ data, item }, { index, hasGutter }) {
  const { columnGap, items = [] } = data;
  
  // 如果没有列间距，直接返回百分比宽度
  if (!hasGutter) {
    return `${(item.span * 100) / 24}%`;
  }
  
  // 获取所有行中的最大列数
  const maxColumnsInAnyRow = getMaxColumnsInAnyRow(items);

  // TODO：兼容，通过最大列来判断每行列数
  if (data.formItemColumn !== maxColumnsInAnyRow) {
    data.formItemColumn = maxColumnsInAnyRow
  }
  
  // 如果最大列数为1，不需要减去间距
  if (maxColumnsInAnyRow === 1) {
    return `${(item.span * 100) / 24}%`;
  }
  
  // 基于最大列数计算总间距
  const totalGapWidth = columnGap * (maxColumnsInAnyRow - 1);
  
  // 基于24栅格计算宽度占比
  const itemWidthRatio = item.span / 24;
  
  return `calc((100% - ${totalGapWidth}px) * ${itemWidthRatio})`;
}

// 获取所有行中的最大列数
function getMaxColumnsInAnyRow(items) {
  let maxColumns = 0;
  let currentRowColumns = 0;
  let currentRowSpan = 0;
  
  for (let i = 0; i < items.length; i++) {
    const itemSpan = items[i]?.span || 8;
    
    // 检查是否需要换行
    if (currentRowSpan + itemSpan > 24) {
      // 更新最大列数
      maxColumns = Math.max(maxColumns, currentRowColumns);
      // 开始新行
      currentRowColumns = 1;
      currentRowSpan = itemSpan;
    } else {
      currentRowSpan += itemSpan;
      currentRowColumns++;
    }
    
    // 如果当前行已满，也要更新最大列数
    if (currentRowSpan === 24) {
      maxColumns = Math.max(maxColumns, currentRowColumns);
      // 重置为下一行
      currentRowColumns = 0;
      currentRowSpan = 0;
    }
  }
  
  // 处理最后一行（如果没有填满24）
  if (currentRowColumns > 0) {
    maxColumns = Math.max(maxColumns, currentRowColumns);
  }
  
  return maxColumns;
}
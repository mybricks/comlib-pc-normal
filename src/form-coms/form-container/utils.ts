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
  
  // 获取当前行的信息
  const currentRowInfo = getCurrentRowInfo(items, index);
  const { columnsInCurrentRow } = currentRowInfo;
  
  // 如果当前行只有一列，不需要减去间距
  if (columnsInCurrentRow === 1) {
    return `${(item.span * 100) / 24}%`;
  }
  
  // 计算当前行的总间距
  const totalGapWidth = columnGap * (columnsInCurrentRow - 1);
  
  // 当前项在当前行中的宽度占比（总span是24）
  const itemWidthRatio = item.span / 24;
  
  return `calc((100% - ${totalGapWidth}px) * ${itemWidthRatio})`;
}

// 获取当前行的信息
function getCurrentRowInfo(items, currentIndex) {
  let accumulatedSpan = 0;
  let columnsInCurrentRow = 0;
  
  // 从当前位置往前找，找到当前行的起始位置
  let rowStartIndex = currentIndex;
  for (let i = currentIndex; i >= 0; i--) {
    const itemSpan = items[i]?.span || 0;
    if (accumulatedSpan + itemSpan > 24) {
      rowStartIndex = i + 1;
      break;
    }
    accumulatedSpan += itemSpan;
    if (i === 0) {
      rowStartIndex = 0;
    }
  }
  
  // 从行起始位置开始计算当前行有多少列
  accumulatedSpan = 0;
  for (let i = rowStartIndex; i < items.length; i++) {
    const itemSpan = items[i]?.span || 0;
    
    if (accumulatedSpan + itemSpan > 24) {
      break; // 超出当前行
    }
    
    accumulatedSpan += itemSpan;
    columnsInCurrentRow++;
    
    if (accumulatedSpan === 24) {
      break; // 当前行已满
    }
  }
  
  return { columnsInCurrentRow };
}
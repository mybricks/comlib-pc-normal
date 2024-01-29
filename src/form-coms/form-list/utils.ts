import { AdditionalItem, ChildrenStore, Data, FormControlInputRels, FormItems } from './types'
import { labelWidthTypes } from './constants'
import { InputIds, OutputIds } from '../types'
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { debounce } from 'lodash';
import { addField } from './components/FormActions';
import { deepCopy } from '../../utils';
import { FormListFieldData } from 'antd';

/**
 * 计算标签宽度
 * @param data 
 * @returns labelCol
 */
export function getLabelCol(data: Data) {
  const labelCol = data.labelWidthType === labelWidthTypes.SPAN
    ? { span: data.labelCol }
    : { flex: `0 0 ${data.labelWidth ? data.labelWidth : 25}px` }

  return labelCol
}

function isObject(val: any) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * 查找子组件
 * @param data 
 * @param com 组件
 * @returns 
 */
export const getFormItem = (data: Data, com): { item: FormItems, isFormItem: true } | { item: AdditionalItem, isFormItem: false } => {
  const { items, additionalItems } = data;
  let item, isFormItem = false;

  // 查找表单项
  item = items.find((item) => {
    return item.comName === com.name
  });
  if (item) return { item, isFormItem: true };

  // 查找非表单项
  item = additionalItems?.find((item) => {
    return item.comName === com.name
  });
  if (item) return { item, isFormItem: false };

  return { item, isFormItem };
}


/**
 * 校验是否存在传入的字段名
 * @param data Data
 * @param name 字段名
 * @returns boolean
 */
export function fieldNameCheck(data: Data, name: string) {
  const fieldNameList = data.items.map(item => item.name)
  if (fieldNameList.includes(name)) {
    return true
  } else {
    return false
  }
}

/**
 * 获取表单项属性
 * @param pros 
 * @param key 属性key
 * @returns 
 */
export function getFormItemProp({ data, com }: { data: Data, com: { name: string, id?: string } }, key: keyof FormItems) {
  try {
    const { item } = getFormItem(data, com) || {};
    return item?.[key];
  } catch (e) {
    console.error(e);
  }
}

/**
 * 设置表单项属性
 * @param props 
 * @param key 属性key
 * @param value 属性value
 */
export function setFormItemProps({ data, com }: { data: Data, com: { name: string, id?: string } }, key: keyof FormItems, value: any) {
  try {
    const { item } = getFormItem(data, com) || {};
    item[key] = value;
  } catch (e) {
    console.error(e);
  }
}

/**
 * 表单项是否显示标题
 * @param props 
 * @returns boolean
 */
export function isShowLabel({ data, com }: { data: Data, com: { name: string, id?: string } }) {
  const showLabel = getFormItemProp({ data, com }, 'showLabel');
  if (typeof showLabel === 'boolean') return showLabel;
  return data.showLabel;
}

/**
 * 判断childrenStore是否收集完成
 * @param param0 
 */
export function isChildrenStoreValid({ data, childrenStore, comCount }: { data: Data, childrenStore: ChildrenStore, comCount: number }) {
  const res = data.fields.every(field => {
    const { key } = field;
    return childrenStore[key]
      && Object.keys(childrenStore[key]).length === comCount
  });
  return res;
}

/**
 * @description 触发表单项校验，并更新校验结果
 */
export function validateForInput(
  { inputs, index, item }: { inputs: FormControlInputRels; index: number; item: any },
  cb?: (val: any) => void
): void {
  inputs?.validate({ ...item }).returnValidate((validateInfo) => {
    if (!item.validateStatus) {
      item.validateStatus = {};
    }
    if (!item.help) {
      item.help = {};
    }
    item.validateStatus[index] = validateInfo?.validateStatus;
    item.help[index] = validateInfo?.help;
    if (cb) {
      cb({
        ...validateInfo,
        index,
        subName: item.name
      });
    }
  });
};

/**
 * 根据childrenStore收集各field数据，更新到data.value
 * @param param0 
 * @returns null
 */
export function getValue({ data, childrenStore, childId, childName, value }: { data: Data, childrenStore: ChildrenStore, childId?: string, childName?: string, value?: any }) {
  return new Promise<any>((resolve, reject) => {
    /** 子表单项值变化 */
    const changedValue = {
      index: -1,
      name: '',
      value,
      inputs: {},
      item: {}
    };

    if (Object.keys(childrenStore).length) {
      let count = 0;
      const allValues: any[] = [];
      Object.keys(childrenStore).forEach((key) => {
        if (!childrenStore[key]) return;

        data.items.forEach((item) => {
          const { id, name, comName, label } = item;
          const { index, inputs, visible } = childrenStore[key][comName];
          if (!allValues[index]) {
            allValues[index] = {};
          }
          const formItemName = name || label;
          inputs?.getValue().returnValue((val) => {
            allValues[index][formItemName] = val;
            count++;
            if (comName === childName && data.value && JSON.stringify(data.value[index]?.[formItemName]) !== JSON.stringify(val)) {
              changedValue.name = formItemName;
              changedValue.index = index;
              changedValue.inputs = inputs;
              changedValue.item = item;
            }
            if (count === data.value?.length) {
              resolve({
                allValues,
                changedValue
              });
            }
          });
        });
      });
    } else {
      resolve({
        allValues: data.value,
        changedValue
      });
    }
  }).then(({
    allValues,
    changedValue
  }) => {
    const { index, name, value, item, inputs } = changedValue;
    if (index < 0) return;
    validateForInput({ item, index, inputs });
    data.value = allValues;
  }).catch(e => {
    console.error('收集值失败，原因：' + e);
  });
};

/**
 * 触发父容器校验
 * @param param0 
 */
export function onValidateTrigger({ parentSlot, id, name }) {
  validateTrigger(parentSlot, { id, name });
};

/**
 * 输出最新的value并触发校验
 * @param param0 
 */
export function changeValue({ id, outputs, parentSlot, name, data }) {
  const { value } = data;
  if (data.userAction.type === 'init') {
    outputs[OutputIds.OnInitial](deepCopy(value));
  } else {
    outputs[OutputIds.OnChange](deepCopy(value));
  }
  onChangeForFc(parentSlot, { id, value, name });
  onValidateTrigger({ parentSlot, id, name });
}

/** 带防抖的值变化事件 */
export const debounceChangeValue = debounce(changeValue, 300);
/** 带防抖的值变化事件 */
export const debounceGetValue = debounce(getValue, 300);

/**
 * 主动收集表单项值更新，并触发相关事件
 * @param props 
 */
export function updateValue(props: (RuntimeParams<Data> & { childrenStore: any, childId: string, childName: string, value: any })) {
  const { data, childrenStore, id, name, outputs, parentSlot, logger, childId, childName, value } = props;
  getValue({ data, childrenStore, childId, childName, value })
    .then(() => {
      changeValue({ data, id, outputs, parentSlot, name });
    })
    .catch((e) => logger.error(e));
}

/**
 * 根据data.value生成fields，用于值从外部传入
 * @param data 
 */
export function generateFields(data: Data) {
  const length = (data.value || []).length;
  if (length > 0) {
    const addedFileds: FormListFieldData[] = [];
    new Array(length).fill(null).map((_, index) => {
      data.MaxKey = data.MaxKey + 1;
      addedFileds.push({
        name: index,
        key: data.MaxKey
      })
    });
    data.fields = addedFileds;
  }
};

/**
 * 数据绑定：容器->子项
 * @param {Data, ChildrenStore, inputId} 
 */
export function setValuesForInput({
  childrenStore,
  data,
}: {
  childrenStore: ChildrenStore,
  data: Data,
}) {
  const { value: values, items: formItems } = data;
  const actionType = data.userAction.type;
  data.userAction.type = '';
  new Promise((resolve, reject) => {
    const cb = () => {
      data.userAction.key = -1;
      resolve(1);
    }
    values?.forEach((value, valIndex) => {
      if (data.userAction.startIndex > valIndex) return;
      const key = data.fields.find(field => field.name === valIndex)?.key;
      const isLast = (valIndex === values.length - 1);
      setValuesOfChild({ data, childrenStore, key, value, actionType }, isLast ? cb : void 0);
    });
  })
    .then(v => {
      data.userAction.startIndex = -1;
    })
    .catch(e => console.error(e));
};

/**
 * 数据绑定：设置某一项数据
 * @param {Data, ChildrenStore, inputId} 
 */
export function setValuesOfChild({
  data,
  childrenStore,
  key,
  value,
  actionType
}: {
  data: Data,
  childrenStore: ChildrenStore,
  key?: React.Key,
  value,
  actionType: string
}, cb?) {
  const { items: formItems } = data;
  // 当设置值/设置初始值/重置值时，需要注意保证各列表项的禁用状态
  let extraAction = '';
  const inputId = actionType === 'add' ? InputIds.SetInitialValue : actionType;
  const inputDoneId = inputId + 'Done';

  if ([InputIds.SetValue, InputIds.SetInitialValue, InputIds.ResetValue].includes(inputId)
    && data.disabled) {
    extraAction = InputIds.SetDisabled;
  }
  const names = data.items.map(item => item.name);
  if (key !== undefined) {
    names.forEach((name, inx) => {
      const item = formItems.find((item) => (item.name || item.label) === name);
      const isLast = (inx === names.length - 1);
      if (item) {
        const { inputs, index } = childrenStore[key][item.comName];
        inputs[inputId] && inputs[inputId](deepCopy(value[name]))
        [inputDoneId]?.(val => {
          if (isLast) {
            cb?.();
          }
        });
        extraAction
          && inputs[extraAction]
          && inputs[extraAction]();
      }
    });
  }
};
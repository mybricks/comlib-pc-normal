import { ChildrenStore, Data, FormControlInputRels } from './types'
import { labelWidthTypes } from './constants'
import { InputIds, OutputIds } from '../types'
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { debounce } from 'lodash';
import { addField } from './components/FormActions';
import { deepCopy } from '../../utils';

export function getLabelCol(data: Data) {
  const labelCol = data.labelWidthType === labelWidthTypes.SPAN
    ? { span: data.labelCol }
    : { flex: `0 0 ${data.labelWidth ? data.labelWidth : 98}px` }

  return labelCol
}

function isObject(val: any) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * 判断childrenStore是否收集完成
 * @param param0 
 */
export function isChildrenStoreValid({ data, childrenStore }: { data: Data, childrenStore: ChildrenStore }) {
  const formItemsCount = data.items.length;
  const res = data.fields.every(field => {
    const { key } = field;
    return childrenStore[key]
      && Object.keys(childrenStore[key]).length === formItemsCount
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
      cb(validateInfo);
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
    let count = 0;
    const allValues: { [k in string]: any }[] = [];
    /** 子表单项值变化 */
    const changedValue = {
      index: -1,
      name: '',
      value,
      inputs: {},
      item: {}
    };
    Object.keys(childrenStore).forEach((key) => {
      if (!childrenStore[key]) return;

      data.items.forEach(item => {
        const { id, name, comName, label } = item;
        const { index, inputs, visible } = childrenStore[key][comName];

        // 未开启“提交隐藏表单项” && 表单项隐藏，不再收集
        if (!data.submitHiddenFields && !visible) {
          return;
        }

        const formItemName = name || label;
        if (!allValues[index]) {
          allValues[index] = {};
        }
        inputs?.getValue().returnValue((val) => {
          allValues[index][formItemName] = val;
          if (id === childId && data.value && JSON.stringify(data.value[index][formItemName]) !== JSON.stringify(val)) {
            changedValue.name = formItemName;
            changedValue.index = index;
            changedValue.inputs = inputs;
            changedValue.item = item;
          }
        });
      });
      count++;
      if (count == data.fields.length) {
        resolve({
          allValues,
          changedValue
        });
      }
    });
    resolve({
      allValues,
      changedValue
    });
  }).then(({
    allValues,
    changedValue
  }) => {
    if (data.value?.[changedValue.index]) {
      const { index, name, value, item, inputs } = changedValue;
      data.value[index] = {
        ...data.value[index],
        [name]: value
      };
      data.value[index][name] = value;
      // data.currentAction = InputIds.SetInitialValue;
      // data.indexList = [index];
      validateForInput({ item, index, inputs });
    } else {
      data.value = allValues;
    }
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
  if (data.currentAction === 'init') {
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
  const newLength = (data.value || []).length;
  const oldLength = data.fields.length;
  const changeLength = newLength - oldLength;
  if (changeLength < 0) {
    data.fields.splice(newLength, -changeLength);
  } else {
    new Array(changeLength).fill(null).map((_, index) => {
      addField({ data });
    });
  }
  return changeLength;
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
  const inputId = data.currentAction;
  data.currentAction = '';

  // 当设置值/设置初始值/重置值时，需要注意保证各列表项的禁用状态
  let extraAction = '';
  if ([InputIds.SetValue, InputIds.SetInitialValue, InputIds.ResetValue].includes(inputId)
    && data.disabled) {
    extraAction = InputIds.SetDisabled;
  }

  new Promise((resolve, reject) => {
    values?.forEach((value, valIndex) => {
      if (data.startIndex > valIndex) return;
      const key = data.fields.find(field => field.name === valIndex)?.key;

      const names = inputId === 'add'
        ? Object.keys(value)
        : data.items.map(item => item.name);

      names.forEach((name) => {
        const item = formItems.find((item) => (item.name || item.label) === name);
        if (item && key !== undefined) {
          const { inputs, index } = childrenStore[key][item.comName];
          if (isObject(value[name])) {
            inputs[inputId] && inputs[inputId]({ ...value[name] });
          } else {
            inputs[inputId] && inputs[inputId](value[name]);
          }
          extraAction
            && inputs[extraAction]
            && inputs[extraAction]();
        }
      });

    });
    resolve(1);
  })
    .then(v => {
      data.startIndex = -1;
    })
    .catch(e => console.error(e));
};
import { ChildrenStore, Data, FormControlInputRels } from './types'
import { labelWidthTypes } from './constants'
import { OutputIds } from '../types'
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { debounce } from 'lodash';

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
export function getValue({ data, childrenStore, childId, value }: { data: Data, childrenStore: ChildrenStore, childId?: string, value?: any }) {
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
        const { id, name, label } = item;
        const { index, inputs, visible } = childrenStore[key][id];

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
          if (id === childId && data.value && data.value[index][formItemName] !== val) {
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
      data.value[index][name] = value;
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
export function onValidateTrigger({ parentSlot, id }) {
  validateTrigger(parentSlot, { id });
};

/**
 * 输出最新的value并触发校验
 * @param param0 
 */
export function changeValue({ id, outputs, parentSlot, data }) {
  const { value } = data;
  onChangeForFc(parentSlot, { id, value });
  outputs[OutputIds.OnChange](value);
  onValidateTrigger({ parentSlot, id });
}

/** 带防抖的值变化事件 */
export const debounceChangeValue = debounce(changeValue, 300);

/**
 * 主动收集表单项值更新，并触发相关事件
 * @param props 
 */
export function updateValue(props: (RuntimeParams<Data> & { childrenStore: any, childId: string, value: any })) {
  const { data, childrenStore, id, outputs, parentSlot, logger, childId, value } = props;
  getValue({ data, childrenStore, childId, value })
    .then(() => {
      changeValue({ data, id, outputs, parentSlot });
    })
    .catch((e) => logger.error(e));
}

/**
 * 根据data.value生成fields，用于值从外部传入
 * @param data 
 */
export function generateFields(data: Data) {
  data.fields = (data.value || []).map((_, index) => {
    return {
      key: index,
      name: index
    };
  });
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
  new Promise((resolve, reject) => {
    values?.forEach((value, valIndex) => {
      if (valIndex < data.startIndex) return;
      const key = data.fields.find(field => field.name === valIndex)?.key;
      Object.keys(value).map((name) => {
        const item = formItems.find((item) => (item.name || item.label) === name);
        if (item && key !== undefined) {
          const { inputs, index } = childrenStore[key][item.id];
          if (isObject(value[name])) {
            inputs[inputId] && inputs[inputId]({ ...value[name] });
          } else {
            inputs[inputId] && inputs[inputId](value[name]);
          }
        }
      });
    });
    resolve(1);
  })
    .then(v => {
      data.currentAction = '';
      data.startIndex = -1;
    })
    .catch(e => console.error(e));
};
import { ChildrenStore, Data } from './types'
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
 * 判断childrenInputs是否收集完成
 * @param param0 
 */
export function isChildrenInputsValid({ data, childrenStore }: { data: Data, childrenStore: ChildrenStore }) {
  const formItemsCount = data.items.length;
  const res = data.fields.every(field => {
    const { key } = field;
    return childrenStore[key]
      && Object.keys(childrenStore[key]).length === formItemsCount
  });
  return res;
}

/**
 * 根据childrenInputs收集各field数据，更新到data.value
 * @param param0 
 * @returns null
 */
export function getValue({ data, childrenStore }: { data: Data, childrenStore: ChildrenStore }) {
  return new Promise<void>((resolve, reject) => {
    /** 隐藏的表单项，不收集数据 **/
    const formItems = data.items.filter((item) => item.visible);

    let count = 0;
    const newVal: { [k in string]: any }[] = [];
    console.log(childrenStore, '------getValue')
    Object.keys(childrenStore).forEach((key) => {
      if (!childrenStore[key]) return;

      data.items.forEach(({ id, name, label }) => {
        const formItemName = name || label;
        const { index, inputs } = childrenStore[key][id];
        if (!newVal[index]) {
          newVal[index] = {};
        }
        inputs?.getValue().returnValue((val) => {
          newVal[index][formItemName] = val;
        });
      });
      count++;
      if (count == data.fields.length) {
        data.value = newVal;
        resolve();
      }
    });
    resolve();
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
export function updateValue(props: (RuntimeParams<Data> & { childrenStore: any })) {
  const { data, childrenStore, id, outputs, parentSlot, logger } = props;
  getValue({ data, childrenStore })
    .then(() => {
      debounceChangeValue({ data, id, outputs, parentSlot });
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
  const inputId = data.currentInputId;
  values?.forEach((value, valIndex) => {
    Object.keys(value).map((name) => {
      const item = formItems.find((item) => (item.name || item.label) === name);
      if (item) {
        const { inputs, index } = childrenStore[valIndex][item.id];
        if (isObject(value[name])) {
          inputs[inputId] && inputs[inputId]({ ...value[name] });
        } else {
          inputs[inputId] && inputs[inputId](value[name]);
        }
      }
    });
  });
  data.currentInputId = '';
};
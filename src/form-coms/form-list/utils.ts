import { ChildrenStore, Data } from './types'
import { labelWidthTypes } from './constants'
import { OutputIds } from '../types'
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { debounce } from 'lodash';
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
export async function getValue({ data, childrenStore, childId, value }: { data: Data, childrenStore: ChildrenStore, childId?: string, value?: any }) {
  try {
    const { allValues: allValues_1, changedValue: changedValue_2 } = await new Promise<any>((resolve, reject) => {
      console.log(childrenStore, '------getValue');
      let count = 0;
      const allValues: {
        [k in string]: any;
      }[] = [];
      /** 子表单项值变化 */
      const changedValue = {
        index: -1,
        name: '',
        value
      };
      Object.keys(childrenStore).forEach((key) => {
        if (!childrenStore[key])
          return;

        data.items.forEach(({ id, name, label }) => {
          const { index, inputs, visible } = childrenStore[key][id];

          // 未开启“提交隐藏表单项” && 表单项隐藏，不再收集
          if (!data.submitHiddenFields && !visible) {
            return;
          }

          const formItemName = name || label;
          if (!allValues[index]) {
            allValues[index] = {};
          }
          inputs?.getValue().returnValue((val_2) => {
            allValues[index][formItemName] = val_2;
            if (id === childId && data.value && data.value[index][formItemName] !== val_2) {
              changedValue.name = formItemName;
              changedValue.index = index;
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
    });
    if (data.value?.[changedValue_2.index]) {
      const { index: index_1, name: name_1, value: value_2 } = changedValue_2;
      data.value[index_1][name_1] = value_2;
    } else {
      data.value = allValues_1;
    }
  } catch (e) {
    console.error('收集值失败，原因：' + e);
  }
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
      console.log('before值更新输出')
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
  const inputId = data.currentInputId;
  values?.forEach((value, valIndex) => {
    if (valIndex < data.startIndex) return;
    const key = data.fields.find(field => field.name === valIndex)?.key;
    console.log(data.currentInputId,data.startIndex, valIndex, key, '---setValuesForInput----')
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
  data.currentInputId = '';
  data.startIndex = -1;
};
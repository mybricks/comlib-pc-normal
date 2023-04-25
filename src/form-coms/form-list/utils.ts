import { ChildrenInputs, Data } from './types'
import { labelWidthTypes } from './constants'
import { OutputIds } from '../types'
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

export function getLabelCol(data: Data) {
  const labelCol = data.labelWidthType === labelWidthTypes.SPAN
    ? { span: data.labelCol }
    : { flex: `0 0 ${data.labelWidth ? data.labelWidth : 98}px` }

  return labelCol
}

export function isObject(val: any) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export function getValue({ data, childrenInputs }: { data: Data, childrenInputs: ChildrenInputs }) {
  return new Promise<void>((resolve, reject) => {
    /** 隐藏的表单项，不收集数据 **/
    const formItems = data.items.filter((item) => item.visible);

    let count = 0;
    const newVal: { [k in string]: any }[] = [];
    console.log(childrenInputs, '------getValue')
    Object.keys(childrenInputs).forEach((key) => {
      if (!childrenInputs[key]) return;

      data.items.forEach(({ id, name, label }) => {
        const formItemName = name || label;
        const { index, inputs } = childrenInputs[key][id];
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

export function onValidateTrigger({ parentSlot, id }) {
  validateTrigger(parentSlot, { id });
};

export function changeValue({ id, outputs, parentSlot, data }) {
  const { value } = data;
  onChangeForFc(parentSlot, { id, value });
  outputs[OutputIds.OnChange](value);
  onValidateTrigger({ parentSlot, id });
}

export function updateValue(props: (RuntimeParams<Data> & { childrenInputs: any })) {
  const { data, childrenInputs, id, outputs, parentSlot, logger } = props;
  getValue({ data, childrenInputs })
    .then(() => {
      changeValue({ data, id, outputs, parentSlot });
    })
    .catch((e) => logger.error(e));
}
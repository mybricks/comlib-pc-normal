import { OutputIds } from './constants';
import { arrayMerge, isSameInputType, objMerge } from './utils';

export default function ({ env, data, inputs, outputs }) {
  const { runtime } = env;
  const { isMerge } = data;
  const inputNum = Object.keys(inputs).length;
  let list: any[] = [];
  const triggerKeys = new Set();
  const mergeStrategy = {
    Array: arrayMerge,
    Object: objMerge
  };

  if (runtime) {
    Object.keys(inputs).forEach((key, index) => {
      inputs[key]((val) => {
        list[index] = val;
        triggerKeys.add(key);
        if (triggerKeys.size === inputNum) {
          const type = isSameInputType(list);
          if (!!isMerge && !!type) {
            outputs[OutputIds.Output](mergeStrategy[type](list));
          } else {
            outputs[OutputIds.Output]([...list]);
          }
          list = [];
          triggerKeys.clear();
        }
      });
    });
  }
}

const SupportType = ['Array', 'Object'];
import { OutputIds } from './constants';

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
          if (isMerge && !!type) {
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

const isSameInputType = (inputs) => {
  const [first, ...rest] = inputs;
  let type = getType(first);
  if (!type || !SupportType.includes(type)) return;
  const isSame = Object.values(rest).every((item) => {
    return getType(item) === type;
  });
  return isSame ? type : null;
};

const getType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)?.[1];
};

const arrayMerge = (inputs) => {
  const ret = new Set(
    inputs.reduce((pre = [], cur) => {
      return [...pre, ...cur];
    }, [])
  );
  return Array.from(ret);
};

const objMerge = (inputs) => {
  const ret = inputs.reduce((pre = {}, cur) => {
    return { ...pre, ...cur };
  }, {});
  return ret;
};

import { OutputIds } from './constants';

export default function ({ env, inputs, outputs }) {
  const { runtime } = env;
  const inputNum = Object.keys(inputs).length;
  let list: any[] = [];
  const triggerKeys = new Set();

  if (runtime) {
    Object.keys(inputs).forEach((key, index) => {
      inputs[key]((val) => {
        list[index] = val;
        triggerKeys.add(key);
        if (triggerKeys.size === inputNum) {
          outputs[OutputIds.Output]([...list]);
          list = [];
          triggerKeys.clear();
        }
      });
    });
  }
}

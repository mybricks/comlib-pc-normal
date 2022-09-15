import { Data, OutputIds } from './constants';

export default function ({ inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  try {
    let valList: any = [];
    const inputNum = Object.keys(inputs).length;
    const triggerKeys = new Set();

    const getOutputVal = () => {
      let res = {};
      valList.forEach((val) => {
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          res = {
            ...res,
            ...val
          };
        }
      });
      return res;
    };

    Object.keys(inputs).forEach((key, index) => {
      inputs[key]((val: any) => {
        triggerKeys.add(key);
        valList[index] = val;
        if (triggerKeys.size === inputNum) {
          outputs[OutputIds.Output](getOutputVal());
          triggerKeys.clear();
          valList = [];
        }
      });
    });
  } catch (ex: any) {
    console.error('js计算组件运行错误.', ex);
    logger.error(`${ex}`);
    onError?.(ex);
  }
}

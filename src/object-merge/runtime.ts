import { get } from 'lodash';
import { Data } from './constants';

export default function ({
  inputs,
  outputs,
  logger,
  onError
}: RuntimeParams<Data>) {
  try {
    let res: any = {};
    let inputsCount = Object.keys(inputs).length;

    Object.keys(inputs).forEach(key => {
      inputs[key]((val: any) => {
        res = {
          ...res,
          ...val
        }
        if (--inputsCount === 0) {
          inputsCount = Object.keys(inputs).length;
          outputs.output(res);
        }
      })
    })
    
  } catch (ex) {
    console.error('js计算组件运行错误.', ex);
    logger.error(`${ex}`);
    onError?.(ex)
  }
}

import { runJs, utils } from '@fangzhou/com-utils';
import moment from 'moment';
import { Data } from './constants';

export default function ({
  env,
  data,
  inputs,
  outputs,
  logger,
  onError
}: RuntimeParams<Data>) {

  // if (env.runtime) {
  const { fns, runImmediate } = data;
  if (fns) {
    try {
      if (runImmediate) {
        if (env.runtime) {
          runJs(fns, [{ outputs }, { ...env, utils: { ...utils, moment } }]);
        }
      }
      inputs.input0((val) => {
        try {
          let inputValue = val;
          runJs(fns, [
            { inputValue, outputs },
            { ...env, utils: { ...utils, moment } }
          ]);
        } catch (ex) {
          //console.error('js计算组件运行错误.', ex)
          onError(ex)
          //logger.error(`${ex}`);
        }
      });
    } catch (ex) {
      onError(ex)
      // console.error('js计算组件运行错误.', ex);
      // logger.error(`${ex}`);
    }
  }
  // }
}

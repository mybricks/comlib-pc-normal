import { runJs } from '../../package/com-utils';
import moment from 'moment';
import { Data } from './constants';

export default function ({
  env,
  data,
  inputs,
  outputs,
  logger
}: RuntimeParams<Data>) {
  if (env.runtime) {
    const { fns, runImmediate } = data;
    if (fns) {
      try {
        if (runImmediate) {
          runJs(fns, [{ outputs }, { ...env, utils: {  moment } }]);
        }
        inputs.input0((val) => {
          try {
            let inputValue = val;
            runJs(fns, [
              { inputValue, outputs },
              { ...env, utils: { moment } }
            ]);
          } catch (ex) {
            console.error('js计算组件运行错误.', ex);
            logger.error(`${ex}`);
          }
        });
      } catch (ex) {
        console.error('js计算组件运行错误.', ex);
        logger.error(`${ex}`);
      }
    }
  }
}

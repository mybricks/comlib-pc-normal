import { runJs, utils } from '../../package/com-utils';
import moment from 'moment';
import { Data } from './constants';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { transformCode, fnBody, fns, fnParams, runImmediate } = data;

  const runJSParams = {
    outputs
  };
  const inputKeys = new Set();
  const inputCount = Object.keys(inputs).length;
  let inputValueMap = {};

  try {
    if (runImmediate) {
      if (env.runtime) {
        runJs(fns, [runJSParams]);
      }
    }

    Object.keys(inputs).forEach((key, index) => {
      inputs[key]((val) => {
        inputKeys.add(key);
        inputValueMap[key.replace('input', 'inputValue')] = val;
        if (inputKeys.size === inputCount) {
          inputKeys.clear();
          try {
            runJs(fns, [
              {
                ...runJSParams,
                inputs: { ...inputValueMap },
                inputValue: inputValueMap['inputValue0']
              }
            ]);
            inputValueMap = {};
          } catch (ex) {
            onError?.(ex);
            console.error('js计算组件运行错误.', ex);
            logger.error(`${ex}`);
          }
        }
      });
    });
  } catch (ex) {
    onError?.(ex);
    console.error('js计算组件运行错误.', ex);
    logger.error(`${ex}`);
  }
}

import { runJs } from './com-utils';
import { Data } from './constants';
import { convertObject2Array } from './util';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { fns, runImmediate } = data;

  const runJSParams = {
    outputs: convertObject2Array(outputs)
  };
  try {
    if (runImmediate) {
      if (env.runtime) {
        runJs(fns, [runJSParams]);
      }
    }
    inputs['input']((val) => {
      try {
        runJs(fns, [
          {
            ...runJSParams,
            inputs: convertObject2Array(val)
          }
        ]);
      } catch (ex: any) {
        onError?.(ex);
        console.error('js计算组件运行错误.', ex);
        logger.error(`${ex}`);
      }
    });
  } catch (ex: any) {
    onError?.(ex);
    console.error('js计算组件运行错误.', ex);
    logger.error(`${ex}`);
  }

}

import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { runImmediate } = data;
  const { getQuery } = env;
  try {
    if (runImmediate) {
      if (env.runtime) {
        outputs['queryData'](getQuery());
      }
    }
    inputs['getQuery']((_, outputRels) => {
      try {
        outputRels['queryData'](getQuery());
      } catch (ex) {
        onError?.(ex);
        console.error('路由参数组件运行错误.', ex);
        logger.error(`${ex}`);
      }
    })
  } catch (ex) {
    onError?.(ex);
    console.error('路由参数组件运行错误.', ex);
    logger.error(`${ex}`);
  }
}
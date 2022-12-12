import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { runImmediate } = data;
  const { vars } = env;
  try {
    if (vars?.getQuery) {
      if (runImmediate) {
        if (env.runtime) {
          outputs['queryData'](vars.getQuery());
        }
      }
  
      inputs['getQuery']((_, outputRels) => {
        try {
          outputRels['queryData'](vars.getQuery());
        } catch (ex) {
          onError?.(ex);
          console.error('路由参数组件运行错误.', ex);
          logger.error(`${ex}`);
        }
      })
    } else {
      onError?.('环境变量 vars.getQuery 方法未实现');
      console.error(`【路由参数】组件： 环境变量 vars.getQuery 方法未实现`);
    }

  } catch (ex) {
    onError?.(ex);
    console.error('路由参数组件运行错误.', ex);
    logger.error(`${ex}`);
  }
}
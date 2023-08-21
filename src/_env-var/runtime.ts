import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { runImmediate } = data;
  const { getExecuteEnv } = env?.vars || {};
  try {
    if (typeof getExecuteEnv === 'function') {
      if (runImmediate && env.runtime) {
        outputs['outputEnv'](getExecuteEnv());
      }

      inputs['getEnv'](() => {
        try {
          outputs['outputEnv'](getExecuteEnv());
        } catch (ex) {
          onError?.(ex);
          console.error('获取环境变量错误.', ex);
          logger.error(`${ex}`);
        }
      })
    } else {
      onError?.('环境变量未设置');
      console.error(`【环境变量】组件：环境变量未设置`);
    }

  } catch (ex) {
    onError?.(ex);
    console.error('环境变量运行错误.', ex);
    logger.error(`${ex}`);
  }
}
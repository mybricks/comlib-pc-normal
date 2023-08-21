import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { runImmediate } = data;
  const { executeEnv } = env;
  try {
    if (typeof executeEnv !== 'undefined') {
      if (runImmediate && env.runtime) {
        outputs['outputEnv'](executeEnv);
      }

      inputs['getEnv'](() => {
        try {
          outputs['outputEnv'](executeEnv);
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
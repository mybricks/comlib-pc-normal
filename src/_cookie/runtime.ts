import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { runImmediate } = data;
  const { vars } = env;
  try {
    if (vars?.getCookies) {
      if (runImmediate) {
        if (env.runtime) {
          outputs['getCookies'](vars.getCookies());
        }
      }

      inputs['getCookies']((_, outputRels) => {
        try {
          outputRels['getCookies'](vars.getCookies());
        } catch (ex: any) {
          onError?.(ex);
          console.error('cookie组件运行错误.', ex);
          logger.error(`${ex}`);
        }
      });
    } else {
      onError?.('环境变量 vars.getCookies 方法未实现');
      console.error(`【cookie】组件： 环境变量 vars.getCookies 方法未实现`);
    }
  } catch (ex: any) {
    onError?.(ex);
    console.error('cookie组件运行错误.', ex);
    logger.error(`${ex}`);
  }
}

import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { runImmediate } = data;
  const { vars } = env;
  try {
    if (vars?.getProps) {
      if (runImmediate) {
        if (env.runtime) {
          outputs['propsData'](vars.getProps());
        }
      }

      inputs['getProps']((_, outputRels: { [x: string]: (arg0: any) => void }) => {
        try {
          outputRels['propsData'](vars.getProps());
        } catch (ex: any) {
          onError?.(ex);
          console.error('获取传参组件运行错误.', ex);
          logger.error(`${ex}`);
        }
      });
    } else {
      onError?.('环境变量 vars.getProps 方法未实现');
      console.error(`【获取传参】组件： 环境变量 vars.getProps 方法未实现`);
    }
  } catch (ex: any) {
    onError?.(ex);
    console.error('获取传参组件运行错误.', ex);
    logger.error(`${ex}`);
  }
}

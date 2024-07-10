import { message } from 'antd';
import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { vars, runtime } = env;

  if(runtime.debug) {
    message.info(`调用主应用函数：${data.targetMethod}`)
    return;
  }

  try {
    const targetMethod = vars?.customMethods?.methodMap?.[data.targetMethod];
    if (!!targetMethod) {
      inputs['emit']?.(props => {
        try {
          const result = targetMethod(props);
          outputs['result']?.(result);
        } catch (ex: any) {
          outputs['error']?.(ex);
        }
      })
    } else {
      onError?.('未找到对应主应用函数.');
      console.error(`【主应用函数】组件：未找到对应主应用函数.`);
    }
  } catch (ex: any) {
    onError?.(ex);
    console.error('【主应用函数】组件：运行错误.', ex);
    logger.error(`${ex}`);
  }
}

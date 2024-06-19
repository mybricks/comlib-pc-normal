import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { runImmediate } = data;
  if (!env.runtime) return
  try {
    const getI18nContent = env?.vars?.getI18nContent || {};
    if (typeof getI18nContent == 'function') {
      if (runImmediate) {
        outputs['output'](getI18nContent());
      }

      inputs['get'](() => {
        try {
          outputs['output'](getI18nContent());
        } catch (ex) {
          onError?.(ex);
          console.error('获取语言包错误.', ex);
          logger.error(`${ex}`);
        }
      })
    } else {
      onError?.('语言包未设置');
      console.error(`【获取语言包】组件：语言包未设置`);
    }

  } catch (ex) {
    onError?.(ex);
    console.error('获取语言包组件错误.', ex);
    logger.error(`${ex}`);
  }
}
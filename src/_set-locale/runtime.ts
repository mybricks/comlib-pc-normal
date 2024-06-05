import { Data } from './constants';

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, outputs, data, logger } = props;
  const { runtime } = env;

  if (runtime && inputs['setLocale']) {
    inputs['setLocale']((val: string) => {
      if (typeof val === 'string') {
        env.locale = val;
        outputs['setLocaleDone'](val);
      } else {
        logger.error('输入语言类型不是字符串');
      }
    });
  }
}

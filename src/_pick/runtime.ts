import { Data } from './types';
import { message } from 'antd';
import { getCodeFromTemplate, sandbox } from './utils';
export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  inputs['inputContext']((context, outputRels) => {
    try {
      const code = getCodeFromTemplate(data.expression);
      const ret = sandbox(code)(context);
      if (typeof ret === 'undefined') {
        throw new Error(`${code} is not defined`);
      }
      if (!!ret) {
        outputs['pickData'](ret);
      } else {
        outputs['pickData'](context);
      }
    } catch (error: any) {
      if (!data.expression) {
        outputs['pickData'](context);
      } else {
        message.error(`取值失败：${error.message}`);
      }
    }
  });
}

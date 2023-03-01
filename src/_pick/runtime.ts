import { Data } from './types';
import { message } from 'antd';
import { sandbox } from './utils';
export default function ({ data, inputs, outputs }: RuntimeParams<Data>) {
  inputs['inputContext']((context) => {
    data.picks.map(({ key, expression }) => {
      if (!expression) {
        outputs[key](context);
        return;
      }
      try {
        const ret = sandbox(expression)(context);
        outputs[key](ret);
      } catch (error: any) {
        message.error(`取值失败：${error.message}`);
      }
    });
  });
}

import { message } from 'antd';
import copy from 'copy-to-clipboard';

export interface Data {
  text: string;
}

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, data } = props;
  const { runtime } = env;

  if (runtime) {
    inputs['copy']((val) => {
      //数据处理
      //1、输入为函数
      if (Object.prototype.toString.call(val) === '[object Function]') {
        val = String(val);
      } else if (typeof val !== 'string') {
        //输入为数组，对象，布尔，null
        if (val === null) {
          val = 'null';
        } else if (val === undefined) {
          val = 'undefined';
        } else {
          val = JSON.stringify(val);
        }
      } else if (val === '') {
        val = ' ';
      }

      data.text = val;
      try {
        copy(data.text);
        message.success(env.i18n(`复制成功:${data.text}`));
      } catch (e) {
        message.success(env.i18n('复制失败', e));
      }
    });
  }
}

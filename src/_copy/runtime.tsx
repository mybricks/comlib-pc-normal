import { message } from 'antd';
import copy from 'copy-to-clipboard';

export interface Data {
  text: string;
}

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, outputs, data } = props;
  const { runtime } = env;

  if (runtime) {
    inputs['copy']((val, outputRels) => {
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
        outputRels['success'](val);
      } catch (e) {
        outputRels['error'](e);
      }
    });
  }
}

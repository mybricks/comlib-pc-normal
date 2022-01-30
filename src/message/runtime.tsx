import { message } from 'antd';
import { Data } from './constants';

// 运行时执行
const runtimeExecute = ({ data, inputs }: RuntimeParams<Data>) => {
  const { type, content, duration } = data;

  // 显示信息
  const open = (str?: string) => {
    const msg = str && typeof str === 'string' ? str : content;
    message[type]({ content: msg, duration });
  };

  // 打开消息提示事件
  if (inputs['showMsg']) {
    inputs['showMsg']((val: string) => {
      try {
        open(val);
      } catch (e) {
        console.error('Message组件仅支持传入字符串', e);
      }
    });
  }
};

export default function (props: RuntimeParams<Data>) {
  const { env } = props;
  const { runtime } = env;

  if (runtime) {
    runtimeExecute(props);
  }
}

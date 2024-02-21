import { message } from 'antd';
import { Data, InputIds, OutputIds } from './constants';
import { uuid } from '../utils';

// 运行时执行
const runtimeExecute = ({ data, inputs, outputs, env }: RuntimeParams<Data>) => {
  const { type, content, duration } = data;
  //结束提示
  const onClose = () => {
    if (data.isEnd) {
      outputs[OutputIds.Close]();
    }
  };

  // 显示信息
  const open = (str?: string) => {
    message[type]({
      content: str || ' ',
      duration,
      onClose: onClose,
      getContainer() {
        return env?.canvasElement || document.body;
      }
    });
  };

  // 打开消息提示事件
  if (inputs[InputIds.Open]) {
    inputs[InputIds.Open]((val: any, outputRels) => {
      if (data.isExternal) {
        //输入为函数
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

        try {
          open(val);
          outputRels[OutputIds.OpenDone](val);
        } catch (e) {
          console.error('Message组件不支持该传入类型内容', e);
        }
      } else {
        try {
          open(env.i18n(content));
          outputRels[OutputIds.OpenDone](env.i18n(content));
        } catch (e) {
          console.error('目前该设置,Message组件仅支持传入静态配置内容', e);
        }
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

import { message } from 'antd';
import { Data, InputIds, OutputIds } from './constants';
import { uuid } from '../utils';

if (ANTD_VERSION === 5) {
  // [TODO] 注入环境变量区分 edit 和 rt
  // [TODO] 待讨论。需要监听取消调试事件以卸载message列表，取消调试后data-canvas['debug']dom卸载，导致message不会被卸载，antd5message列表维护在一份全局实例里。
  message.config({
    getContainer: () => {
      // 不挂#_geoview-wrapper_ [data-canvas='debug']的话，提示不居中，shadowRoot宽度比调试的画布要快
      // const container = document.getElementById('_mybricks-geo-webview_')?.shadowRoot;
      // 挂#_geoview-wrapper_ [data-canvas='debug']，取消调试时如果message还没结束，下去调试还会再弹出来
      const container = document.getElementById('_mybricks-geo-webview_')?.shadowRoot?.querySelector("#_geoview-wrapper_ [data-canvas='debug']");
      return container as HTMLElement;
    }
  })
}



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

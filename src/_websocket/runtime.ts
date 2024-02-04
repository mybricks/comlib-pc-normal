function callCon({ env, data, outputs, logger }) {
  const { wsUrl } = data;

  try {
    if (wsUrl) {
      // 创建一个新的WebSocket对象
      var websocket = new WebSocket(wsUrl);

      // 连接成功建立时触发
      websocket.onopen = function (evt) {
        outputs['onconnect'](`连接成功`);
        if (typeof env?.runtime?.onComplete === 'function') {
          env.runtime.onComplete(() => {
            websocket?.close()
          })
        }
      };

      // 接收到消息时触发
      websocket.onmessage = function (evt) {
        outputs['onmessage'](evt.data);
      };

      // 连接关闭时触发
      websocket.onclose = function (evt) {
        outputs['onClose'](evt);
      };

      // 发生错误时触发
      websocket.onerror = function (evt) {
        outputs['onerror'](`发生错误`, evt?.data);
      };
    } else {
      outputs['onerror'](`没有设置websocket地址`);
    }
  } catch (e) {
    console.error(`websocket组件运行错误.`, e);
    outputs['onerror'](`websocket创建失败，请检查地址是否正确`);
  }
}

function call({ env, data, outputs, params, logger }) {
  callCon({ env, data, outputs, logger }, params, data.wsUrl);
}

export default function ({ env, data, inputs, outputs, logger }) {
  if (env.runtime) {
    if (data.immediate) {
      callCon({ env, data, outputs, logger });
    } else {
      inputs['call']((params) => {
        call({ env, data, logger, params: typeof params === 'object' ? params : {}, outputs });
      });
    }
  }
}

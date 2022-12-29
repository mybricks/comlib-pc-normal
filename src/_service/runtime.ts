import { INPUT_ID, PARAMS_READY, READY, URL_READY } from './const';

function callCon({ env, data, outputs }, params = {}, connectorConfig = {}) {
  if (data.connector) {
    try {
      env
        .callConnector(data.connector, params, connectorConfig)
        .then((val) => {
          outputs['then'](val);
        })
        .catch((err) => {
          outputs['catch'](err);
        });
    } catch (ex) {
      console.error(ex);

      outputs['catch'](`执行错误 ${ex.message || ex}`);
      //onError(ex.message)
    }
  } else {
    outputs['catch'](`没有选择接口`);
  }
}

function call({ env, data, outputs }) {
  if (data.callReady === READY) {
    data.callReady = PARAMS_READY;
    callCon({ env, data, outputs }, data.params, data.connectorConfig);
  }
}

export default function ({ env, data, inputs, outputs }) {
  if (env.runtime) {
    if (data.immediate) {
      callCon({ env, data, outputs });
    } else {
      inputs['call']((params) => {
        data.params = params;
        data.callReady |= data.useExternalUrl ? PARAMS_READY : READY;
        call({ env, data, outputs });
      });
      inputs[INPUT_ID.SET_URL]((url: string) => {
        if (url && typeof url === 'string') {
          data.connectorConfig.url = url;
        }
        data.callReady |= URL_READY;
        call({ env, data, outputs });
      });
    }
  }
}

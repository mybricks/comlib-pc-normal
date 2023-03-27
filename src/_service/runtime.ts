import { INPUT_ID, PARAMS_READY, READY, URL_READY } from './const';

function callCon({ env, data, outputs }, params = {}, connectorConfig = {}) {
  if (data.connector) {
    try {
      env
        .callConnector(data.connector, params, { openMock: data.mock, ...connectorConfig })
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

function call({ env, data, outputs, params }) {
  if (data.callReady === READY) {
    data.callReady = PARAMS_READY;
    callCon({ env, data, outputs }, params, data.connectorConfig);
  }
}

export default function ({ env, data, inputs, outputs }) {
  let curParams;
  if (env.runtime) {
    if (data.immediate) {
      callCon({ env, data, outputs });
    } else {
      inputs['call']((params) => {
        data.callReady |= data.useExternalUrl ? PARAMS_READY : READY;
        curParams = params;
        call({ env, data, params: typeof params === 'object' ? params : {}, outputs });
      });
      inputs[INPUT_ID.SET_URL]((url: string) => {
        if (url && typeof url === 'string') {
          data.connectorConfig.url = url;
        }
        data.callReady |= URL_READY;
        call({ env, data, outputs, params: curParams });
      });
    }
  }
}

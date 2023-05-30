import { INPUT_ID, PARAMS_READY, READY, URL_READY } from './const';

function callCon({ env, data, outputs }, params = {}, connectorConfig = {}) {
	const { runtime } = env;
	/** 调试 */
	const debug = !!(runtime && runtime.debug);
  if (data.connector) {
    try {
			const isObjectParams = typeof params === 'object' && params !== null;
	    const curParams: Record<string, unknown> = isObjectParams ? { ...params } : params;
			
			/** 展示运行日志 */
			if (debug && isObjectParams && data.showToplLog) {
				curParams.showToplLog = data.showToplLog;
			}
      env
        .callConnector(data.connector, curParams, { openMock: data.mock, mockSchema: data.outputSchema, ...connectorConfig })
        .then((val) => {
	        if (curParams.showToplLog && typeof val === 'object' && val !== null && val.__ORIGIN_RESPONSE__) {
						window?.postMessage?.(JSON.stringify({ type: 'DOMAIN_LOGS', title: data.connector.title, logStack: val.__ORIGIN_RESPONSE__?.logStack || [] }), '*');
		        outputs['then'](val.outputData);
	        } else {
		        outputs['then'](val);
	        }
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

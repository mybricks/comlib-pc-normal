import { INPUT_ID, PARAMS_READY, READY, URL_READY } from './const';

function callCon({ env, data, outputs, logger }, params = {}, connectorConfig = {}) {
	const { runtime } = env;
	/** 调试 */
	const debug = !!(runtime && runtime.debug);
  const { connector, dynamicConfig } = data
  if (connector || dynamicConfig) {
    try {
			const isObjectParams = typeof params === 'object' && Object.prototype.toString.call(params) !== '[object FormData]' && params !== null;
	    const curParams: Record<string, unknown> = isObjectParams ? { ...params } : params;
			
			/** 展示运行日志 */
			if (debug && isObjectParams && data.showToplLog) {
				curParams.showToplLog = data.showToplLog;
			}

      let finalConnector = connector
      let finalOptions = { openMock: data.globalMock || data.mock, mockSchema: data.outputSchema }

      if (dynamicConfig) {
        finalConnector = dynamicConfig
        finalOptions = { openMock: dynamicConfig.globalMock || data.mock, mockSchema: dynamicConfig.outputSchema }
      }

      env
        .callConnector(finalConnector, curParams, { ...finalOptions, ...connectorConfig })
        .then((val) => {
	        if (curParams.showToplLog && typeof val === 'object' && val !== null && val.__ORIGIN_RESPONSE__) {
		        (val.__ORIGIN_RESPONSE__?.logStack || []).map(log => {
              let value: any = log.value;

              if (Array.isArray(value) || (typeof value === 'object' && value !== null) || typeof value === 'boolean') {
                value = JSON.stringify(value);
              }
              logger.info(` [${log.typeLabel}]  ${log.nodeType === 'com' ? '组件' : (log.nodeType === 'frame' ? '服务卡片' : 'Fx卡片')}${log.type !== 'sql' ? `：${log.title || log.id} | ${log.pinTitle || log.pinId}` : ''}  当前值：${value}`, data.connector.title);
            });
            outputs['then'](val.outputData);
	        } else {
		        outputs['then'](val);
	        }
        })
        .catch((err) => {
          outputs['catch'](err);
        });
    } catch (ex: any) {
      console.error(ex);

      outputs['catch'](`执行错误 ${ex.message || ex}`);
      //onError(ex.message)
    }
  } else {
    outputs['catch'](`没有选择接口`);
  }
}

function call({ env, data, outputs, params, logger }) {
  if (data.callReady === READY) {
    data.callReady = PARAMS_READY;
    callCon({ env, data, outputs, logger }, params, data.connectorConfig);
  }
}

export default function ({ env, data, inputs, outputs, logger }) {
  let curParams;
  if (env.runtime) {
    if (data.immediate) {
      callCon({ env, data, outputs, logger });
    } else {
      inputs['call']((params) => {
        data.callReady |= data.useExternalUrl ? PARAMS_READY : READY;
        curParams = params;
        call({ env, data, logger, params: typeof params === 'object' ? params : {}, outputs });
      });
      inputs[INPUT_ID.SET_URL]((url: string) => {
        if (url && typeof url === 'string') {
          data.connectorConfig.url = url;
        }
        data.callReady |= URL_READY;
        call({ env, data, logger, outputs, params: curParams });
      });
    }
  }
}

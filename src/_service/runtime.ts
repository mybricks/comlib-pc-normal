import { OUTPUT_ID, PARAMS_READY, READY } from './const';

function callCon({ env, data, outputs, logger }, params = {}, connectorConfig = {}) {
  const { connector, dynamicConfig } = data;

  if (connector || dynamicConfig) {
    try {
      let finalConnector = connector
      let finalOptions = { openMock: data.globalMock || data.mock, outputSchema: data.outputSchema, mockOutputId: data.mockOutputId }

      if (dynamicConfig) {
        finalConnector = dynamicConfig
        finalOptions = { openMock: dynamicConfig.globalMock || data.mock, outputSchema: dynamicConfig.outputSchema, mockOutputId: dynamicConfig.mockOutputId }
      }

      env
        .callConnector(
          finalConnector,
	        params,
          {
            ...finalOptions,
            ...connectorConfig,
            onResponseInterception: response => {
              outputs[OUTPUT_ID.HEADERS]?.(response.headers || {});
            },
            isMultipleOutputs: true
          }
        )
        .then((val) => {
          outputs[val?.__OUTPUT_ID__ ?? 'then'](val?.__ORIGIN_RESPONSE__ ?? val);
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
    }
  }
}

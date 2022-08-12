import {
  OUTPUT_ID_RES,
  OUTPUT_ID_ERROR,
  INPUT_ID_PARAMS,
  Data
} from './constants';

export default function ({ env, data, outputs, inputs, logger }: RuntimeParams<Data>) {
  const { immediate } = data;
  if (env?.runtime && inputs) {
    inputs[INPUT_ID_PARAMS]((val) => {
      fetchData(data, val, env, outputs, logger);
    });

    if (immediate) {
      fetchData(data, {}, env, outputs, logger);
    }
  }
}

function fetchData(data: Data, params: any, env: Env, outputs: any, logger: any) {
  // if (data.isMock) {
  //   setTimeout(() => {
  //     outputs[OUTPUT_ID_RES](mockData);
  //   }, 300);
  //   return;
  // }

  const {
    serviceContent: globalServiceContent = {},
    insideServiceContent = {},
    serviceType = 'global'
  } = data;
  const serviceContent =
    serviceType === 'inside' ? insideServiceContent : globalServiceContent;

  if (!serviceContent.id) {
    logger.error('接口未选择');
    return
  }

  try {
    env
      .callService(serviceContent.id, params)
      .then((r) => {
        outputs[OUTPUT_ID_RES](r);
      })
      .catch((e) => {
        logger.error(e && (e.message || e.error_msg))
        outputs[OUTPUT_ID_ERROR](e && (e.message || e.error_msg));
      });
  } catch (e) {
    logger.error(e && (e.message || e.error_msg))
    outputs[OUTPUT_ID_ERROR](e && (e.message || e.error_msg));
  }
}

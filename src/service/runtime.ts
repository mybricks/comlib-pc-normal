import {
  OUTPUT_ID_RES,
  OUTPUT_ID_ERROR,
  INPUT_ID_PARAMS,
  Data
} from './constants';


export default function ({ env, data, outputs, inputs, onError }: RuntimeParams<Data>) {
  const { immediate } = data;
  if (env?.runtime && inputs) {
    inputs[INPUT_ID_PARAMS]((val) => {
      fetchData(data, val, env, outputs, onError);
    });

    if (immediate) {
      fetchData(data, {}, env, outputs, onError);
    }
  }
}

function fetchData(data: Data, params: any, env: Env, outputs: any, onError) {
  const {
    serviceContent: globalServiceContent = {},
    insideServiceContent = {},
    serviceType = 'global'
  } = data;
  const serviceContent =
    serviceType === 'inside' ? insideServiceContent : globalServiceContent;

  if (!serviceContent.id) {
    onError('接口未选择');
    return
  }

  try {
    env
      .callService(serviceContent.id, params)
      .then((r) => {
        outputs[OUTPUT_ID_RES](r);
      })
      .catch((e: any) => {
        onError(`接口调用异常`);
        outputs[OUTPUT_ID_ERROR](e && (e.message || e.error_msg));
      });
  } catch (e: any) {
    onError(`接口调用异常`);
    outputs[OUTPUT_ID_ERROR](e && (e.message || e.error_msg));
  }
}

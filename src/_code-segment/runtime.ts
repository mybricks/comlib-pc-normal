import { runJs, utils } from '../utils/codeEditor';
import moment from 'moment';
import { Data } from './constants';

const getFnString = (fnBody: string, fnParams: string[]) => {
  return `function _RT_ ({${fnParams.join(',')}}) {${fnBody}}`;
};

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { transformCode, fnBody, fns, fnParams, runImmediate } = data;
  // const fns = {
  //   transformCode: transformCode || getFnString(fnBody, fnParams),
  //   code: getFnString(fnBody, fnParams)
  // };

  const runJSParams = {
    context: {
      getQuery: env.getQuery,
      getUserInfo: env.getUserInfo,
      hasPermission: env.hasPermission,
      utils: { ...utils, moment }
    },
    outputs
  };
  
  try {
    if (runImmediate) {
      if (env.runtime) {
        runJs(fns, [runJSParams]);
      }
    }
    inputs.input0((val: any) => {
      try {
        runJs(fns, [{ ...runJSParams, inputValue: val }]);
      } catch (ex) {
        onError?.(ex);
        console.error('js计算组件运行错误.', ex);
        logger.error(`${ex}`);
      }
    });
  } catch (ex) {
    onError?.(ex);
    console.error('js计算组件运行错误.', ex);
    logger.error(`${ex}`);
  }
}

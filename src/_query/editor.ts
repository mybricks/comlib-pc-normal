import { Data } from './types';
export default {
  '@init': ({ data, setAutoRun, isAutoRun, output }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.runImmediate) {
      setAutoRun(true);
      data.runImmediate = true;
    }
  },
  ':root'({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [];
  }
};

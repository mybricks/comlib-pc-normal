import { Data, EnumStorage } from './types';

export default function ({ env, data, inputs, outputs, onError }: RuntimeParams<Data>) {
  const { runtime } = env;
  const { runImmediate } = data;
  const getStorage = () => {
    data.picks.map(({ id, itemKey }) => {
      if (!itemKey) {
        onError?.(`key不能为空`);
        outputs[id]('');
        return;
      }

      let res =
        data.storageType === EnumStorage.SESSION
          ? sessionStorage.getItem(itemKey)
          : localStorage.getItem(itemKey);

      try {
        if (res !== null) {
          res = JSON.parse(res);
        }
        outputs[id](res);
      } catch (error: any) {
        outputs[id](res);
      }
    });
  };
  try {
    if (runImmediate && runtime) {
        getStorage();
    } else {
      inputs['inputContext'](() => {
        getStorage();
      });
    }
  } catch (ex: any) {
    onError?.(ex);
    console.error('获取Storage数据组件运行错误.', ex);
  }
}

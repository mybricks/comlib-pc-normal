import { Data, EnumStorage } from './types';

export default function ({ data, inputs, outputs, onError }: RuntimeParams<Data>) {
  data.picks.map(({ id, itemKey }) => {
    if (!itemKey) {
      onError?.(`key不能为空`)
      outputs[id]('');
      return;
    }

    let res = data.storageType === EnumStorage.SESSION
      ? sessionStorage.getItem(itemKey)
      : localStorage.getItem(itemKey)

    try {
      if (res !== null) {
        res = JSON.parse(res)
      }
      outputs[id](res);
    } catch (error: any) {
      outputs[id](res);
    }
  });

}

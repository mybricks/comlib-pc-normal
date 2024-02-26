import { EnumStorage, OutputIds } from './constants';

export default function ({ env, data, inputs, outputs, onError }: RuntimeParams<Data>) {


  const setStorage = (val) => {
    if (typeof data.key !== 'string' || data.key?.trim() === '') {
      const errorMsg = `storage的key不能为空`
      onError?.(errorMsg);
      console.error(errorMsg);
    }


    try {
      const tempVal = typeof val === 'string' ? val : JSON.stringify(val)

      if (data.storageType === EnumStorage.sessionStorage) {
        sessionStorage.setItem(data.key, tempVal)
      } else {
        localStorage.setItem(data.key, tempVal);
      }

      outputs[OutputIds.SetDataDone](val);
    } catch (error: any) {
      onError?.(error);
      console.error(error);
      outputs[OutputIds.SetDataDone](val);
    }
  };

  inputs['setData'](setStorage);

}

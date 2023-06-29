import { isObject } from 'lodash';
import { Data } from './types';
export default function ({ data, env, style, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { enumMap } = data;
  const { runtime } = env;
  if (runtime) {
    inputs['input']((val) => {
      if (isObject(val) && !!Object.keys(enumMap).length) {
        for (const [key, newKey] of Object.entries(enumMap)) {
          if (val.hasOwnProperty(key)) {
            val[newKey] = val[key];
            delete val[key];
          }
        }
      }
      outputs['output'](val);
    });
  }
}
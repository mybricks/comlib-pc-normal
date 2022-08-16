import { Data } from './types';
export default function ({ data, env, style, inputs, outputs }: RuntimeParams<Data>) {
  const { keyMap } = data;
  const { runtime } = env;
  if (runtime) {
    inputs['input']((val) => {
      const type = Object.prototype.toString.call(val).match(/\[object (.*)\]/)[1];
      if (type === 'Object' && !!Object.keys(keyMap).length) {
        for (const [key, newKey] of Object.entries(keyMap)) {
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

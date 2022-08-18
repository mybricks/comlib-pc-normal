import { Logic, Data } from './types';

export default function ({ data, env, inputs, outputs }: RuntimeParams<Data>) {
  const { logic } = data;
  const { runtime } = env;
  const list = [];
  if (runtime) {
    const inputCount = Object.keys(inputs).length;
    Object.keys(inputs).forEach((key) => {
      inputs[key]((val) => {
        list.push(val);
        if (list.length === inputCount) {
          const result = logicStrategy[logic](list);
          if (result) {
            outputs['onSuccess'](result);
          } else {
            outputs['onFail'](result);
          }
        }
      });
    });
  }
}

const logicStrategy = {
  [Logic.AND]: (inputs) => {
    return inputs.every((input) => !!input);
  },
  [Logic.OR]: (inputs) => {
    return inputs.some((input) => !!input);
  }
};

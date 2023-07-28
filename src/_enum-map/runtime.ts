import { isEqual } from 'lodash';
import { Data } from './types';
export default function ({ data, env, inputs, outputs }: RuntimeParams<Data>) {
  const { enumMap, valueToKey, dynamicMap } = data;
  const { runtime } = env;
  if (runtime) {
    inputs.input(({ val, goalMap }) => {
      const map = dynamicMap ? goalMap : enumMap;
      if (valueToKey) {
        const targetKey = Object.keys(map).find((key) => isEqual(map[key], val));
        outputs.output(targetKey);
        return;
      }
      outputs.output(map[val]);
    });
  }
}

import { Data, ResolveType } from './types';

export default function ({ data, env, inputs, outputs }: RuntimeParams<Data>) {
  const { resolveType, splitChar, joinChar, targetChar, replaceChar, isReplaceAll } = data;
  const { runtime } = env;
  if (runtime) {
    inputs['input']((val: any) => {
      let result = val;
      if (getType(val) === 'String' && resolveType === ResolveType.SPLIT) {
        result = resolveStrategy[resolveType](val, splitChar);
      }
      if (getType(val) === 'Array' && resolveType === ResolveType.JOIN) {
        result = resolveStrategy[resolveType](val, joinChar);
      }
      if (getType(val) === 'String' && resolveType === ResolveType.REPLACE) {
        result = resolveStrategy[resolveType](val, targetChar, replaceChar, isReplaceAll);
      }
      outputs['output'](result);
    });
  }
}

const getType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1];
};

const resolveStrategy = {
  [ResolveType.JOIN]: (input: [], char: string) => input.join(char),
  [ResolveType.SPLIT]: (input: string, char: string) => input.split(char),
  [ResolveType.REPLACE]: (input: string, target, replace, isReplaceAll) => {
    const reg = new RegExp(target, `i${isReplaceAll ? 'g' : ''}`);
    return input.replace(reg, replace);
  }
};

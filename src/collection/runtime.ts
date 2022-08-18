import { Data, ResolveType } from './types';

export default function ({ data, env, inputs, outputs }: RuntimeParams<Data>) {
  const { resolveType, sort, flat } = data;
  const { runtime } = env;
  if (runtime) {
    inputs['input']((val: any[]) => {
      if (getType(val) === 'Array') {
        if (resolveType) {
          const result = resolveStrategy[resolveType](val, { sort, flat });
          outputs['output'](result);
        } else {
          outputs['output'](val);
        }
      } else {
        console.error('输入数据类型错误');
      }
    });
  }
}

const getType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1];
};

const resolveStrategy = {
  [ResolveType.SORT]: (input = [], params: any = {}) => {
    const { sort } = params;
    const { type, sortKey } = sort
    if (sortKey) {
      if (type === 'down') {
        return input.sort((next, pre) => {
          if (next.hasOwnProperty(sortKey) && pre.hasOwnProperty(sortKey)) {
            return pre[sortKey] - next[sortKey];
          }
          return 0;
        });
      }
      return input.sort((next, pre) => {
        if (next.hasOwnProperty(sortKey) && pre.hasOwnProperty(sortKey)) {
          return next[sortKey] - pre[sortKey];
        }
        return 0;
      });
    } else {
      if (type === 'down') {
        return input.sort((next, pre) => pre - next);
      }
      return input.sort((next, pre) => next - pre);
    }
  },
  [ResolveType.FLAT]: (input = [], params: any = {}) => {
    const { flat } = params;
    const { level } = flat
    return input.flat(level);
  },
  [ResolveType.UNIQUE]: (input = [], params = {}) => Array.from(new Set(input))
};

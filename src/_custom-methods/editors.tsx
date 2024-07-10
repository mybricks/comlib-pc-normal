import { Data } from './types';

export default {
  ':root'({ env }: EditorResult<Data>, cate1) {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '目标方法',
        type: 'select',
        options: env.vars?.customMethods?.options || [],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.targetMethod;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.targetMethod = value;
          }
        }
      }
    ];
  }
};

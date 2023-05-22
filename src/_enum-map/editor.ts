import { Data } from './types';
export default {
  ':root'({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '映射',
        type: 'map',
        value: {
          get({ data }: EditorResult<Data>) {
            return data;
          },
          set({ data }: EditorResult<Data>, val: string) {
            
          }
        }
      }
    ];
  }
};

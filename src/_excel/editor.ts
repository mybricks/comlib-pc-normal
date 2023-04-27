import { Data } from './types';
export default {
  ':root'({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '导出文件名',
        type: 'text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.filename;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.filename = val
          }
        }
      }
    ];
  }
};

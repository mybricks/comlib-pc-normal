import { Data } from './types';

export default {
  ':root'({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.name;
          },
          set({ data }: EditorResult<Data>, name: string) {
            data.name = name;
          }
        }
      },
      {
        title: '点击事件',
        type: '_Event',
        options: {
          outputId: 'click'
        }
      }
    ];
  }
};

import { Data, InputIds } from './types';
export default {
  ':root'({ input,data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '动态设置导出文件名',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useDynamicFilename;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            if(val) {
              input.add({
                id: InputIds.Filename,
                title: '设置导出文件名',
                schema: {
                  type: 'string'
                },
              });
            } else {
              input.remove(InputIds.Filename)
            }
            data.useDynamicFilename = val;
          }
        }
      },
      {
        title: '导出文件名',
        type: 'text',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.useDynamicFilename;
        },
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

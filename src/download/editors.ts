import { Data } from './constants';
export default {
  ':root': [
    {
      title: '名称',
      type: 'text',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.name;
        },
        set({ data }: EditorResult<Data>, name: string) {
          data.name = name;
        }
      }
    }
  ]
};

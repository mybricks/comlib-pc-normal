import { Data } from './types';
export default {
  ':root': [
    {
      title: '映射关系',
      type: 'map',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.keyMap;
        },
        set({ data }: EditorResult<Data>, val: object) {
          data.keyMap = val;
        }
      }
    }
  ]
};
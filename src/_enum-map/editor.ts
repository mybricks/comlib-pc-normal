import { Data } from './types';
export default {
  ':root': [
    {
      title: '映射关系',
      type: 'map',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.enumMap;
        },
        set({ data }: EditorResult<Data>, val: Data['enumMap']) {
          data.enumMap = val;
        }
      }
    }
  ]
};

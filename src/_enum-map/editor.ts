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
    },
    // {
    //   title: '值取键',
    //   type: 'switch',
    //   description: '默认根据输入键值获取键名',
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return !!data.valueToKey;
    //     },
    //     set({ data }: EditorResult<Data>, val: boolean) {
    //       data.valueToKey = val;
    //     }
    //   }
    // },
    {
      title: '动态数据',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return !!data.dynamicMap;
        },
        set({ data, inputs }: EditorResult<Data>, val: boolean) {
          data.dynamicMap = val;
          if (val) {
            inputs.add('input.goalMap', '目标对象', { type: 'follow' }, true);
          } else {
            inputs.remove('input.goalMap');
          }
        }
      }
    }
  ]
};

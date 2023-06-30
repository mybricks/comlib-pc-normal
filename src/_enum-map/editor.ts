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
    {
      title: '值取键',
      type: 'switch',
      description: '默认根据输入键名获取键值',
      value: {
        get({ data }: EditorResult<Data>) {
          return !!data.valueToKey;
        },
        set({ data }: EditorResult<Data>, val: boolean) {
          data.valueToKey = val;
        }
      }
    },
    {
      title: '动态数据',
      type: 'switch',
      ifVisible({ data }: EditorResult<Data>) {
        return false;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return !!data.dynamicMap;
        },
        set({ data, inputs }: EditorResult<Data>, val: boolean) {
          data.dynamicMap = val;
          const _inputIO = inputs.get('input');
          const defaultSchema = [
            {
              name: 'val',
              title: '输入值',
              type: 'follow'
            }
          ];
          if (val) {
            defaultSchema.push({
              name: 'goalMap',
              title: '目标对象',
              type: 'follow'
            });
          }
          _inputIO?.setSchema(defaultSchema);
        }
      }
    }
  ]
};

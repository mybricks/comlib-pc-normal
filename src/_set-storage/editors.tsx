import { EnumStorage, OutputIds, InputIds } from './constants';

export default {
  ':root': [
    {
      title: '保存方式',
      type: 'select',
      description: '选择将数据保存到localStorage或sessionStorage中',
      options: [
        { label: 'localStorage', value: EnumStorage.localStorage },
        { label: 'sessionStorage', value: EnumStorage.sessionStorage }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.storageType;
        },
        set({ data, output }: EditorResult<Data>, val: EnumStorage) {
          data.storageType = val;
        }
      }
    },
    {
      title: 'key',
      type: 'Text',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.key;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.key = value;
        }
      }
    }
  ]
};

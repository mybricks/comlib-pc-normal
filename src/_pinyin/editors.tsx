import { Data } from './constants';

export default {
  ':root': [
    // {
    //   title: '输出内容',
    //   type: 'select',
    //   description: '可以切换输出汉字拼音首字母、单个汉字拼音数组及拼音字符串',
    //   options: [
    //     {
    //       label: '拼音首字母',
    //       value: 'firstLetter'
    //     },
    //     {
    //       label: '拼音数组',
    //       value: 'pinyinArr'
    //     },
    //     {
    //       label: '拼音字符串',
    //       value: 'pinyinStr'
    //     },
    //   ],
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.valType || 'firstLetter';
    //     },
    //     set({ data }: EditorResult<Data>, val: 'firstLetter' | 'pinyinArr' | 'pinyinStr') {
    //       data.valType = val;
    //     }
    //   }
    // },
    {
      title: '分隔符',
      type: 'Text',
      description: '默认无分隔符',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.splitChart || '';
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.splitChart = value;
        }
      }
    }
  ]
};

import { Data } from './runtime';
import { SpinSize } from 'antd/es/spin';

interface Result {
  data: Data;
  focusArea?: any;
  output: any;
  input: any;
}

export default {
  ':root': [
    {
      title: '加载图标大小',
      type: 'Select',
      options: [
        { label: '大', value: 'large' },
        { label: '中', value: 'default' },
        { label: '小', value: 'small' }
      ],
      value: {
        get({ data }: Result) {
          return data.size || 'default';
        },
        set({ data }: Result, value: SpinSize) {
          data.size = value;
        }
      }
    },
    {
      title: '描述文案',
      type: 'Text',
      options: {
        locale: true
      },
      value: {
        get({ data }: Result) {
          return data.tip || '加载中';
        },
        set({ data }: Result, value: string) {
          data.tip = value;
        }
      }
    }
  ]
};

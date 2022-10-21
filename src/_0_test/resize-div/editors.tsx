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
      title: '列间距',
      type: 'inputNumber',
      options: [{ min: 0, maxWidth: 100, width: 120 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.gutter];
        },
        set({ data }: EditorResult<Data>, val: Array<number>) {
          data.gutter = val[0];
        }
      }
    }
  ]
};

import { Data, InputIds, OutputIds } from './types';

export default {
  '@init': ({ data, output }: EditorResult<Data>) => {},
  ':root': [
    {
      title: '倒计时时间',
      type: 'inputnumber',
      description: '单位秒,也可以动态传入,动态传入是数字或者能转换成数字的字符即可',
      options: [{ min: 1, max: Infinity, width: 200, step: 60 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.staticTime];
        },
        set({ data }: EditorResult<Data>, val: number[]) {
          data.staticTime = val[0];
        }
      }
    },
    {
      title: '立即触发',
      description: '开启后会立即触发一次执行',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.immediate;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.immediate = value;
        }
      }
    },
    {
      title: '是否格式化输出',
      type: 'Switch',
      description: '默认输出剩余秒数',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.isFormat;
        },
        set({ data, output }: EditorResult<Data>, val: boolean) {
          data.isFormat = val;
          output.get(OutputIds.ResidualTime).setSchema({
            type: data.isFormat ? 'string' : 'number'
          });
        }
      }
    },
    {
      title: '输出时间格式模版',
      type: 'select',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isFormat;
      },
      options: {
        options: [
          { label: '时:分:秒', value: 'HH:mm:ss' },
          { label: '时:分', value: 'HH:mm' },
          { label: '时', value: 'HH' },
          { label: '自定义脚本', value: 'custom' }
        ]
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.format || 'HH:mm:ss';
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.format = val;
        }
      }
    },
    {
      title: '自定义模版',
      type: 'text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isFormat && data.format === 'custom';
      },
      options: {
        placeholder: 'HH:mm:ss'
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.customFormat;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.customFormat = val;
        }
      }
    },
    {
      title: '停止倒计时',
      description: '开启后，支持停止倒计时',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useStop;
        },
        set({ data, input }: EditorResult<Data>, value: boolean) {
          data.useStop = value;
          if (value) {
            input.add(InputIds.StopCountdown, '停止倒计时', { type: 'any' });
            input.get(InputIds.StopCountdown).setRels([OutputIds.CountdownOut]);
          } else {
            input.remove(InputIds.StopCountdown);
          }
        }
      }
    }
  ]
};

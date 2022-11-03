import { Data } from './constants';

export default {
  '@outputConnected'({ data }, fromPin, toPin) {
    data.outSchema = toPin.schema;
  },
  ':root': [
    {
      title: '数组长度',
      type: 'inputnumber',
      options: [{ min: 1, max: 20, width: 60 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.arrLength];
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.arrLength = value[0];
        }
      }
    },
    {
      title: '字符串长度',
      type: 'inputnumber',
      options: [{ min: 1, max: 20, width: 60 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.strLength];
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.strLength = value[0];
        }
      }
    },
    {
      title: '随机数范围',
      type: 'InputNumber',
      options: [
        { title: '最小', min: 0, width: 100 },
        { title: '最大', max: 999999, width: 100 }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.numberRange || [0, 100];
        },
        set({ data }: EditorResult<Data>, value: [number, number]) {
          data.numberRange = value;
        }
      }
    }
  ]
};

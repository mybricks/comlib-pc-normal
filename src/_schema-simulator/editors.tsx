import { Data } from './constants';

export default {
  //“any类型”
  // '@outputConnected'({ data, output }, fromPin, toPin) {
  //   //如果是“any”，schema跟着后面的schema
  //   if (fromPin.schema.type === 'any') {
  //     data.outSchema = toPin.schema;
  //     output.get('outputData').setSchema(data.outSchema);
  //   } else {
  //     //否则，schema拿到自己编辑好的
  //     data.outSchema = fromPin.schema;
  //     output.get('outputData').setSchema(data.outSchema);
  //   }
  // },
  // '@outputUpdated'({ data, input, output, slots }, pin) {
  //   //编辑区更新了，重重存储
  //   data.outSchema = pin.schema;
  // },

  //"follow类型"
  '@outputUpdated'({ data, input, output, slots }, pin) {
    //编辑区更新了，重重存储
    data.outSchema = pin.schema;
    //加上这一句会死循环
    //output.get('outputData').setSchema(data.outSchema);
  },

  ':root': [
    {
      title: '数组长度',
      type: 'inputnumber',
      options: [{ min: 1, max: 100, width: 60 }],
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

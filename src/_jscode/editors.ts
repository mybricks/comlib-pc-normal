import {CODE_TEMPLATE, COMMENTS, Data} from './constants';

export default {
  '@init': ({data, setAutoRun, isAutoRun}: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.runImmediate) {
      setAutoRun(true);
      data.runImmediate = true;
    }
    if (!data.fns) {
      data.fns = encodeURIComponent(CODE_TEMPLATE);
    }
  },
  // '@inputConnected': ({data, input, output, setAutoRun, isAutoRun}
  //   , from: { id, title, schema, parent }
  //   , to: { id, title, schema, parent }) => {
  //   if (to.schema.type === 'follow') {
  //     const inPin = input.get(to.id)
  //     inPin.setSchema(from.schema)//follow
  //   }
  // },
  // '@inputDisConnected': ({data, input, output, setAutoRun, isAutoRun}
  //   , from: { id, title, schema, parent }
  //   , to: { id, title, schema, parent }) => {
  //   const inPin = input.get(to.id)
  //   inPin.setSchema({type: 'follow'})//follow
  // },
  // '@outputConnected': ({data, input, output, setAutoRun, isAutoRun}
  //   , from: { id, title, schema, parent }
  //   , to: { id, title, schema, parent }) => {
  //   if (from.schema.type === 'follow') {
  //     const outPin = output.get(from.id)
  //     outPin.setSchema(to.schema)//follow
  //   }
  // },
  // '@outputDisConnected': ({data, input, output, setAutoRun, isAutoRun}
  //   , from: { id, title, schema, parent }
  //   , to: { id, title, schema, parent }) => {
  //   const outPin = output.get(from.id)
  //   outPin.setSchema({type: 'follow'})//follow
  // },
  ':root': [
    // {
    //   title: '立即运行',
    //   type: 'Switch',
    //   // ifVisible({ isAutoRun }: EditorResult<Data>) {
    //   //   // 配置兼容
    //   //   // 在项目面板起点
    //   //   // 隐藏
    //   //   const autoRun = isAutoRun ? isAutoRun() : false;
    //   //   if (autoRun) {
    //   //     return false;
    //   //   }
    //   //   return true;
    //   // },
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.runImmediate;
    //     },
    //     set({ data, setAutoRun }: EditorResult<Data>, value: boolean) {
    //       if (setAutoRun) {
    //         setAutoRun(value);
    //       }
    //       data.runImmediate = value;
    //     }
    //   }
    // },
    {
      title: '添加输出项',
      type: 'Button',
      value: {
        set({data, output}: EditorResult<Data>) {
          const idx = getOutputOrder({output});
          const hostId = `output${idx}`;
          const title = `输出项${idx}`;
          output.add(
            hostId,
            title,
            {
              type: 'follow'
            },
            true,
            1
          );
        }
      }
    },
    {
      type: 'code',
      options: {
        comments: COMMENTS,
        theme: 'light',
        minimap: {
          enabled: false
        }
      },
      title: '代码编辑',
      value: {
        get({data}: EditorResult<Data>) {
          return data.fns || CODE_TEMPLATE;
        },
        set({data}: EditorResult<Data>, fns: string) {
          data.fns = fns;
        }
      }
    }
  ]
};

function getOutputOrder({output}) {
  const ports = output.get();
  const {id} = ports.pop();
  return Number(id.slice(6)) + 1;
}

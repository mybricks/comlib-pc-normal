import { CODE_TEMPLATE, COMMENTS, Data } from './constants';

export default {
  '@init': ({ data, setAutoRun, isAutoRun }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.runImmediate) {
      setAutoRun(true);
      data.runImmediate = true;
    }
    if (!data.fns) {
      data.fns = encodeURIComponent(CODE_TEMPLATE);
    }
  },
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
        set({ data, output }: EditorResult<Data>) {
          const idx = getOutputOrder({ data, output });
          const title = `输出项${idx}`;
          const hostId = `output${idx}`;

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
        get({ data }: EditorResult<Data>) {
          return data.fns || CODE_TEMPLATE;
        },
        set({ data }: EditorResult<Data>, fns: string) {
          data.fns = fns;
        }
      }
    }
  ]
};

function getOutputOrder({ data, output }) {
  if (data.outputCount === void 0) {
    const c = Object.keys(output.get()).length;
    data.outputCount = c;
  }
  return data.outputCount++;
}

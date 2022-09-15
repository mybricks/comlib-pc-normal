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
    {
      title: '添加输出项',
      type: 'Button',
      value: {
        set({ data, output }: EditorResult<Data>) {
          const idx = getOutputOrder({ output });
          const hostId = `output${idx}`;
          const title = `输出项${idx}(${hostId})`;
          output.add({
            id: hostId,
            title,
            schema: {
              type: 'unknown'
            },
            editable: true, //可编辑
            deletable: true
          });
        }
      }
    },
    {
      type: 'code',
      options: {
        babel: true,
        comments: COMMENTS,
        theme: 'light',
        minimap: {
          enabled: false
        },
        eslint: {
          parserOptions: {
            ecmaVersion: '2020',
            sourceType: 'module'
          }
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

function getOutputOrder({ output }) {
  const ports = output.get();
  const { id } = ports.pop();
  return Number(id.slice(6)) + 1;
}

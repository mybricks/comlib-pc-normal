import { CODE_TEMPLATE, COMMENTS, Data } from './constants';

const getFnParams = ({ data, outputs }) => {
  const params = ['context','inputValue', ...outputs.get().map(({ id }) => id)];
  if (data.runImmediate) {
    params.splice(1, 1);
  }
  return params;
};

const getExtralib = ({ outputs }) => {
  return [
    ...outputs.get().map(({ id, title }) => 
    `/** \n* ${title} \n*/ \ndeclare function ${id}(val: any): void`),
    `declare var inputValue: any;`,
  ].join(';\n');
};

// editors inject run method
const forceRender = { run: () => {} };

export default {
  '@init': ({ data, setAutoRun, isAutoRun, output }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.runImmediate) {
      setAutoRun(true);
      data.runImmediate = true;
    }
    data.fns = data.fns || encodeURIComponent(CODE_TEMPLATE);
    // data.fnBody = data.fnBody || encodeURIComponent(CODE_TEMPLATE);
    // data.fnParams = data.fnParams || getFnParams({ data, outputs: output });
  },
  '@pinRemoved'({ data, outputs}){
    // data.fnParams = getFnParams({ data, outputs });
  },
  '@inputUpdated'({ data }, fromPin) {
    data.inputSchema = fromPin.schema;
  },
  '@inputConnected'({ data }, fromPin) {
    data.inputSchema = fromPin.schema;
  },
  '@inputDisConnected'({ data }) {
    data.inputSchema = { type: 'any' };
  },
  ':root': [
    {
      title: '添加输出项',
      type: 'Button',
      value: {
        set({ output }: EditorResult<Data>) {
          const idx = getOutputOrder({ output });
          const hostId = `output${idx}`;
          const title = `输出项${idx}`;
          output.add({
            id: hostId,
            title,
            schema: {
              type: 'unknown'
            },
            editable: true,
            deletable: true
          });
          // data.fnParams = getFnParams({ data, outputs: output });
          // forceRender.run();
        }
      }
    },
    {
      type: 'code',
      options: ({ data, outputs }) => {
        const option = {
          babel: true,
          comments: COMMENTS,
          theme: 'light',
          minimap: {
            enabled: false
          },
          lineNumbers: 'on',
          // forceRender,
          eslint: {
            parserOptions: {
              ecmaVersion: '2020',
              sourceType: 'module'
            }
          },
          schema: data.inputSchema
        };
        // Object.defineProperty(option, 'fnParams', {
        //   get() {
        //     return getFnParams({data, outputs });
        //   },
        //   configurable: true
        // });
        // Object.defineProperty(option, 'extraLib', {
        //   get() {
        //     return getExtralib({ outputs });
        //   },
        //   configurable: true
        // });
        return option;
      },
      title: '代码编辑',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.fns || CODE_TEMPLATE;
        },
        set({ data }: EditorResult<Data>, fns: any) {
          // const { code, transformCode } = fns;
          // data.fnBody = code;
          // data.transformCode = transformCode;
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

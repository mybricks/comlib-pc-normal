import { OUTPUT_ID } from './const';
const defaultSchema = { type: 'any' };
const defaultOutputId = 'then';

export default {
  '@init': ({ data, setDesc, setAutoRun, isAutoRun }) => {
    data.connectorConfig = data.connectorConfig || {};
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.immediate) {
      setAutoRun(true);
      data.immediate = true;
    }
    setDesc(`（连接器为空）`);
  },
  '@connectorUpdated': ({ data, input, output, setDesc, setAutoRun, isAutoRun }, { connector }) => {
    if (!data.connector) return;
    if (connector.id === data.connector.id) {
      updateConnector({ data, input, output }, connector);

      setDesc(`已选择：${data.connector.title}`);
    }

  },
  '@connectorRemoved': ({ data, input, output, setDesc, setAutoRun, isAutoRun }, { connector }) => {
    if (!data.connector) return;

    if (connector.id === data.connector.id) {
      data.globalMock = false;
      data.connector = void 0;
      input.get('call')?.setSchema(defaultSchema);
      data.outputSchema = defaultSchema;
      data.mockOutputId = defaultOutputId;

      output.get().forEach(o => {
        if (o.id === 'then') {
          output.get(o.id).setSchema(defaultSchema);
        } else if (o.id !== 'catch') {
          output.remove(o.id);
        }
      });

      setDesc(`${connector.title} 已失效`);
    }
  },
  ':root': [
    {
      title: '连接器',
      type: '_connectorSelect',
      value: {
        get({ data }) {
          return data.connector;
        },
        set({ data, input, output, setDesc }, connector) {
          updateConnector({ data, input, output }, connector);

          setDesc(`已选择：${data.connector.title}`);
        }
      }
    },
    {
      title: '输出请求头(Headers)',
      type: 'switch',
      value: {
        get({ data }) {
          return data.outputHeaders;
        },
        set({ data, output }, use: boolean) {
          if (use) {
            output.add(OUTPUT_ID.HEADERS, '请求头输出项', { type: 'object', properties: {} });
            data.outputHeaders = true;
          } else {
            output.remove(OUTPUT_ID.HEADERS);
            data.outputHeaders = false;
          }
        }
      }
    },
    {
      title: '数据模拟（调试时）',
      type: 'switch',
      value: {
        get({ data }) {
          return data.mock;
        },
        set({ data }, use: boolean) {
          data.mock = use;
        }
      }
    },
    {
      title: '模拟输出项（调试时）',
      description: '开启数据模拟时，根据所选输出项类型进行模拟',
      type: 'select',
      options({ output }) {
        return {
          get options() {
            return output.get().map(o => ({ label: o.title, value: o.id }));
          }
        };
      },
      value: {
        get({ data }) {
          return data.mockOutputId || defaultOutputId;
        },
        set({ data, output }, value: string) {
          data.mockOutputId = value;
          data.outputSchema = output.get(value).schema || defaultSchema;
        }
      }
    },
    {},
    {
      title: '动态配置',
      type: 'switch',
      value: {
        get({ data }) {
          return data.showDynamicConfig;
        },
        set({ data, configs }, showDynamicConfig: boolean) {
          if (showDynamicConfig) {
            configs.add({
              id: 'dynamicConfig',
              title: '连接器',
              schema: {
                type: 'object'
              },
              binding: 'data.dynamicConfig',
              editor: {
                type: '_connectorSelect'
              }
            });
          } else {
            configs.remove('dynamicConfig');
          }
          data.showDynamicConfig = showDynamicConfig;
        }
      }
    }
  ]
};

function isValidSchema(schema) {
  return (
    schema &&
    ['object', 'array', 'number', 'string', 'boolean', 'any', 'follow', 'unknown'].some(
      (type) => schema.type === type
    )
  );
}

function updateConnector({ input, output, data }, connector) {
  data.globalMock = connector.globalMock;
  data.connector = {
    id: connector.id,
    title: connector.title,
    type: connector.type,
    connectorName: connector.connectorName,
    script: connector.script,
  };
  updateIO({ input, output, data }, connector);
}

function updateIO({ input, output, data }, connector) {
  const callInt = input.get('call');
  if (callInt) {
    if (isValidSchema(connector.inputSchema)) {
      callInt.setSchema(connector.inputSchema);
    } else {
      callInt.setSchema(defaultSchema);
    }
  }

  if (connector.markList?.length) {
    output.get().forEach(o => {
      if (o.id !== 'then' && o.id !== 'catch') {
        output.remove(o.id);
      }
    });
    connector.markList?.forEach(mark => {
      const schema = isValidSchema(mark.outputSchema) ? mark.outputSchema : defaultSchema;

      if (mark.id === 'default') {
        const then = output.get('then');
        then.setSchema(schema);
        then.setTitle(`${mark.title}(标记组)`);
      } else {
        const out = output.get(mark.id);
        if (!out) {
          output.add(mark.id, `${mark.title}(标记组)`, schema);
        } else {
          output.get(mark.id).setSchema(schema);
        }
      }
    });
  } else {
    output.get().forEach(o => {
      if (o.id === 'then') {
        output.get(o.id).setSchema(isValidSchema(connector.outputSchema) ? connector.outputSchema : defaultSchema);
      } else if (o.id !== 'catch') {
        output.remove(o.id);
      }
    });
  }

  /** 处理 Mock Schema */
  const allOutput = output.get();
  const curOutput = allOutput.find(o => o.id === data.mockOutputId);

  if (curOutput) {
    data.outputSchema = output.get(curOutput.id).schema;
  } else {
    data.mockOutputId = defaultOutputId;
    data.outputSchema = output.get(defaultOutputId).schema;
  }
}

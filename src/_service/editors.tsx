const defaultSchema = { type: 'any' };
import { INPUT_ID } from './const';

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
      data.globalMock = connector.globalMock;
      data.connector = {
        id: connector.id,
        title: connector.title,
        type: connector.type,
        connectorName: connector.connectorName,
        script: connector.script,
        inputSchema: connector.inputSchema,
        outputSchema: connector.outputSchema
      };

      if (data.hasUpdatedOutputSchema) {
        const callInt = input.get('call');
        if (callInt) {
          if (isValidSchema(connector.inputSchema)) {
            callInt.setSchema(connector.inputSchema);
          } else {
            callInt.setSchema(defaultSchema);
          }
        }
      } else {
        data.outputSchema = connector.outputSchema;
        updateIO({ input, output }, connector);
      }

      setDesc(`已选择：${data.connector.title}`);
    }
  },
  '@connectorRemoved': ({ data, input, output, setDesc, setAutoRun, isAutoRun }, { connector }) => {
    if (!data.connector) return;

    if (connector.id === data.connector.id) {
      data.globalMock = false;
      data.connector = void 0;

      const callInt = input.get('call');
      if (callInt) {
        callInt.setSchema(defaultSchema);
      }

      const thenOut = output.get('then');
      thenOut.setSchema(defaultSchema);
      data.outputSchema = defaultSchema;

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
          data.connector = connector;
          data.globalMock = connector.globalMock;
          data.outputSchema = data.connector.outputSchema;
          updateIO({ input, output }, connector);

          setDesc(`已选择：${data.connector.title}`);
        }
      }
    },
    {
      title: '配置服务地址',
      type: 'switch',
      ifVisible({ data }) {
        return !data.immediate;
      },
      value: {
        get({ input }) {
          return input.get(INPUT_ID.SET_URL) !== void 0;
        },
        set({ data, input }, use: boolean) {
          const callPin = input.get('call');
          if (use) {
            input.add(INPUT_ID.SET_URL, '设置服务地址', { type: 'string' });
            if (!callPin) {
              input.add('call', '调用', { type: 'object' });
            }
            data.useExternalUrl = true;
          } else {
            input.remove(INPUT_ID.SET_URL);
            data.useExternalUrl = false;
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
      title: '响应数据结构',
      type: '_schema',
      value: {
        get({ data }) {
          return data.outputSchema;
        },
        set({ data, output }, outputSchema) {
          data.outputSchema = outputSchema;
          data.hasUpdatedOutputSchema = true;

          const thenOut = output.get('then');
          thenOut.setSchema(data.outputSchema);
        }
      }
    },
    {
      title: '运行日志（调试时）',
      description: '在调试时获取接口运行日志，可根据日志分析接口运行情况',
      type: 'switch',
      ifVisible({ data }) {
        return data.connector?.type === 'http-sql';
      },
      value: {
        get({ data }) {
          return data.showToplLog;
        },
        set({ data }, use: boolean) {
          data.showToplLog = use;
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

function updateIO({ input, output }, connector) {
  const callInt = input.get('call');
  if (callInt) {
    if (isValidSchema(connector.inputSchema)) {
      callInt.setSchema(connector.inputSchema);
    } else {
      callInt.setSchema(defaultSchema);
    }
  }
  const thenOut = output.get('then');

  if (isValidSchema(connector.outputSchema)) {
    thenOut.setSchema(connector.outputSchema);
  } else {
    thenOut.setSchema(defaultSchema);
  }
}

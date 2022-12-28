const defaultSchema = { type: 'any' };

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
      data.connector = {
        id: connector.id,
        title: connector.title,
        type: connector.type,
        script: connector.script,
        inputSchema: connector.inputSchema,
        outputSchema: connector.outputSchema
      };

      updateIO({ input, output }, connector);

      setDesc(`已选择：${data.connector.title}`);
    }
  },
  '@connectorRemoved': ({ data, input, output, setDesc, setAutoRun, isAutoRun }, { connector }) => {
    if (!data.connector) return;

    if (connector.id === data.connector.id) {
      data.connector = void 0;

      const callInt = input.get('call');
      if (callInt) {
        callInt.setSchema(defaultSchema);
      }

      const thenOut = output.get('then');
      thenOut.setSchema(defaultSchema);

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
        get({ data, configs }) {
          const cfg = configs.get('url');
          return cfg !== void 0;
        },
        set({ data, configs, setDesc }, set) {
          if (set) {
            configs.add({
              id: 'url',
              title: '设置服务地址',
              schema: {
                type: 'string'
              },
              binding: `data.connectorConfig.url`
            });
          } else {
            configs.get('url').remove();
          }
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

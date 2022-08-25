const defaultSchema = { type: 'any' };

export default {
  '@init': ({data, setDesc, setAutoRun, isAutoRun}) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.immediate) {
      setAutoRun(true);
      data.immediate = true;
    }
    setDesc(`（连接器为空）`)
  },
  '@connectorUpdated': ({data, input, output, setDesc, setAutoRun, isAutoRun}, {connector}) => {
    if (!data.connector) return;

    if (connector.id === data.connector.id) {
      data.connector = {
        id: connector.id,
        title: connector.title,
        script: connector.script,
        inputSchema: connector.inputSchema,
        outputSchema: connector.outputSchema
      }

      updateIO({input, output}, connector)

      setDesc(`已选择：${data.connector.title}`)
    }
  },
  '@connectorRemoved': ({data, input, output, setDesc, setAutoRun, isAutoRun}, {connector}) => {
    if (!data.connector) return;

    if (connector.id === data.connector.id) {
      data.connector = void 0

      const callInt = input.get('call')
      if (callInt) {
        callInt.setSchema(defaultSchema)
      }

      const thenOut = output.get('then')
      thenOut.setSchema(defaultSchema)

      setDesc(`${connector.title} 已失效`)
    }
  },
  ':root': [
    {
      title: '连接器',
      type: '_connectorSelect',
      value: {
        get({data}) {
          return data.connector;
        },
        set({data, input, output, setDesc}, connector) {
          data.connector = {
            id: connector.id,
            title: connector.title,
            script: connector.script,
            inputSchema: connector.inputSchema,
            outputSchema: connector.outputSchema,
          }

          updateIO({input, output}, connector)

          setDesc(`已选择：${data.connector.title}`)
        }
      }
    },
  ]
}

function updateIO({input, output}, connector) {
  const callInt = input.get('call')
  if (callInt) {
    if (connector.inputSchema) {
      callInt.setSchema(connector.inputSchema)
    } else {
      callInt.setSchema(defaultSchema)
    }
  }
  const thenOut = output.get('then')

  if (connector.outputSchema) {
    thenOut.setSchema(connector.outputSchema)
  } else {
    thenOut.setSchema(defaultSchema)
  }
}

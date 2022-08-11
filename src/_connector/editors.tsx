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
    if (connector.id === data.connector.id) {
      data.connector = void 0

      const callInt = input.get('call')
      if (callInt) {
        callInt.setSchema(void 0)
      }

      const thenOut = output.get('then')
      thenOut.setSchema(void 0)

      setDesc(`${connector.title} 已失效`)
    }
  },
  ':root': [
    // {
    //   title: 'Mock请求',
    //   type: 'switch',
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.isMock;
    //     },
    //     set({ data }: EditorResult<Data>, value: boolean) {
    //       data.isMock = value;
    //     }
    //   }
    // },
    // {
    //   title: '立即请求',
    //   type: 'switch',
    //   ifVisible({ isAutoRun }: EditorResult<Data>) {
    //     // 配置兼容
    //     // 在项目面板起点
    //     // 隐藏
    //     const autoRun = isAutoRun ? isAutoRun() : false;
    //     if (autoRun) {
    //       return false;
    //     }
    //     return true;
    //   },
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.immediate;
    //     },
    //     set({ data, setAutoRun }: EditorResult<Data>, value: boolean) {
    //       if (setAutoRun) {
    //         setAutoRun(value);
    //       }
    //       data.immediate = value;
    //     }
    //   }
    // },
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
            outputSchema: connector.outputSchema
          }

          updateIO({input, output}, connector)

          setDesc(`已选择：${data.connector.title}`)
        }
      }
    },
    {
      title: '填写请求参数',
      type: 'switch',
      ifVisible({data}) {
        return !!data.connector?.inputSchema
      },
      value: {
        get({data}) {
          return data.paramsByInput
        }, set({data}, val) {
          data.paramsByInput = val
        }
      }
    },
    {
      title: '请求参数',
      type: 'inputGroup',
      ifVisible({data}) {
        return !!data.paramsByInput
      },
      options({data}) {
        if (data.connector) {
          const properties = data.connector.inputSchema?.items?.properties
          if (typeof properties === 'object' && properties) {
            const keys = Object.keys(properties)

            return keys.map(nm => {
              const to = properties[nm]
              return {
                title: nm,
                name: nm,
                type:nm.type,
                defaultValue: to.default
              }
            })
          }
        }
      },
      value: {
        get({data}) {
          return data.params
        }, set({data},params) {
          data.params = params
        }
      }
    }
  ]
}


function updateIO({input, output}, connector) {
  const callInt = input.get('call')
  if (callInt) {
    if (connector.inputSchema) {
      callInt.setSchema(connector.inputSchema)
    } else {
      callInt.setSchema(void 0)
    }
  }
  const thenOut = output.get('then')

  if (connector.outputSchema) {
    thenOut.setSchema(connector.outputSchema)
  } else {
    thenOut.setSchema(void 0)
  }
}

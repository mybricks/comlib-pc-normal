export const descriptionUpList = [
  {
    type: 'input',
    id: 'setSource',
    schema: {
      type: 'array',
      description: '数组格式的数据源，渲染到左侧,需要包含以下字段title, key，description等字段',
      items: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: '数据项的唯一标识key'
          },
          title: {
            type: 'string',
            description: '数据项的标题'
          },
          description: {
            type: 'string',
            description: '数据项的描述'
          },
          disabled: {
            type: 'boolean',
            description: '是否禁用，可选的'
          }
        }
      }
    }
  },
  {
    type: 'output',
    id: 'returnValue',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: '数据项的唯一标识key'
          },
          title: {
            type: 'string',
            description: '数据项的标题'
          },
          description: {
            type: 'string',
            description: '数据项的描述'
          },
          disabled: {
            type: 'boolean',
            description: '是否禁用，可选的'
          }
        }
      }
    }
  },
  {
    type: 'output',
    id: 'setSourceDone',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: '数据项的唯一标识key'
          },
          title: {
            type: 'string',
            description: '数据项的标题'
          },
          description: {
            type: 'string',
            description: '数据项的描述'
          },
          disabled: {
            type: 'boolean',
            description: '是否禁用，可选的'
          }
        }
      }
    }
  },
  {
    type: 'output',
    id: 'onChange',
    schema: {
      type: 'array',
      description: '数组格式的目标数据源，选中的数据列表，包含基础key,title,description等字段',
      items: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: '数据项的唯一标识key'
          },
          title: {
            type: 'string',
            description: '数据项的标题'
          },
          description: {
            type: 'string',
            description: '数据项的描述'
          },
          disabled: {
            type: 'boolean',
            description: '是否禁用，可选的'
          }
        }
      }
    }
  }
];

export const onSelectChangeSchema = {
  type: 'object',
  properties: {
    sourceSelectedKeys: {
      type: 'array',
      description: '源数据数据项的唯一标识key数组',
      items: {
        type: 'string',
        description: '源数据数据项的唯一标识key'
      }
    },
    targetSelectedKeys: {
      type: 'array',
      description: '目标数据项的唯一标识key数组',
      items: {
        type: 'string',
        description: '目标数据项的唯一标识key'
      }
    }
  }
};

export default function ({ input, output }): boolean {
  //1.0.0 -> 1.0.1
  input.get('setValue').setSchema({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        }
      }
    }
  });
  input.get('uploadDone').setSchema({
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      url: {
        type: 'string'
      }
    }
  });

  // 1.0.1 -> 1.0.2
  output.get('upload').setSchema({
    type: 'object'
  })

  //1.0.2 -> 1.0.3
  const valueSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        status: {
          type: 'string'
        },
        percent: {
          type: 'number'
        },
        response: {
          type: 'string'
        }
      }
    }
  };
  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }
  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  input.get('setValue').setSchema({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        status: {
          type: 'string'
        },
        percent: {
          type: 'number'
        },
        response: {
          type: 'string'
        }
      }
    }
  });
  input.get('uploadDone').setSchema({
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      url: {
        type: 'string'
      },
      status: {
        type: 'string'
      },
      percent: {
        type: 'number'
      },
      response: {
        type: 'string'
      }
    }
  });
  return true;
}

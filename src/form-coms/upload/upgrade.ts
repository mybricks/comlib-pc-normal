export default function ({ input, output, slot, data }): boolean {
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
  });

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

  if (!input.get('remove')) {
    input.add('remove', '删除文件', {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        uid: {
          type: 'string'
        }
      }
    });
  }

  if (!output.get('remove')) {
    output.add('remove', '删除文件', {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        uid: {
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
  }

  /**
   * @description v1.0.7 , 新增自定义插槽, 展示文件列表
  */
  if (!slot?.get('carrier')) {
    slot.add('carrier', '添加组件')
  }
  if (typeof data.isShowUploadList === "undefined") {
    data.isShowUploadList = true;
  };
  if (typeof data.isCustom === "undefined") {
    data.isCustom = false;
  };

  /**
   * @description v1.0.8 , 新增尺寸校验
  */
  if (typeof data.imageSize === "undefined") {
    data.imageSize = [0,0];
  };
  
  return true;
}

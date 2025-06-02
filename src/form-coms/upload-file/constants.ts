const itemsSchema = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "文件名"
    },
    "url": {
      "type": "string",
      "description": "文件地址"
    },
    "status": {
      "type": "string",
      "description": "文件上传状态"
    },
    "percent": {
      "type": "number",
      "description": "文件上传进度，百分比"
    },
    "response": {
      "type": "string",
      "description": "服务端响应内容"
    }
  }
}
export const descriptionUpList = [
  {
    type: 'input',
    id: 'setValue',
    schema: {
      "type": "array",
      "description": "设置上传表单项的值",
      "items": itemsSchema
    }
  },
  {
    type: 'input',
    id: 'setInitialValue',
    schema: {
      "type": "array",
      "description": "设置上传表单项的值",
      "items": itemsSchema
    }
  },
  {
    type: 'input',
    id: 'remove',
    schema: {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "文件名"
        },
        "uid": {
          "type": "string",
          "description": "文件唯一标识符"
        }
      }
    }
  },
  {
    type: 'output',
    id: 'setValueDone',
    schema: {
      "type": "array",
      "description": "输出上传表单项的值",
      "items": itemsSchema
    }
  },
  {
    type: 'output',
    id: 'removeDone',
    schema:  {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "文件名"
        },
        "uid": {
          "type": "string",
          "description": "文件唯一标识符"
        }
      }
    }
  },
  {
    type: 'output',
    id: "returnValue",
    schema: {
      "type": "array",
      "description": "输出上传表单项的值",
      "items": itemsSchema
    }
  },
  {
    type: 'output',
    id: "onInitial",
    schema: {
      "type": "array",
      "description": "值初始化后，输出上传表单项的值",
      "items": itemsSchema
    }
  },
  {
    type: 'output',
    id: 'setInitialValueDone',
    schema:  {
      "type": "array",
      "description": "输出上传表单项的值",
      "items": itemsSchema
    }
  },
  {
    type: 'output',
    id: "remove",
    schema: {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "文件名"
        },
        "uid": {
          "type": "string",
          "description": "文件唯一标识符"
        },
        "url": {
          "type": "string",
          "description": "文件地址"
        },
        "status": {
          "type": "string",
          "description": "文件上传状态"
        },
        "percent": {
          "type": "number",
          "description": "文件上传进度，百分比"
        },
        "response": {
          "type": "string",
          "description": "服务端响应内容"
        }
      }
    }
  },
  {
    type: 'output',
    id: 'uploadComplete',
    schema: itemsSchema
  }
]
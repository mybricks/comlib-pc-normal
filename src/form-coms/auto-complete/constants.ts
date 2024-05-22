export const descriptionUpList = [
  {
    type: 'input',
    id: 'setOptions',
    schema: {
      "title": "输入数据源数据",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "title": "标签",
            "description": "选项标签（一般展示）",
            "type": "string"
          },
          "value": {
            "title": "值",
            "description": "选项值",
            "type": "string"
          }
        }
      }
    }
  },
  {
    type: 'input',
    id: "setValidateInfo",
    schema: {
      "type": "object",
      "properties": {
        "validateStatus": {
          "type": "enum",
          "descriptions": "校验状态，成功/失败",
          "items": [
            {
              "type": "string",
              "value": "success"
            },
            {
              "type": "string",
              "value": "error"
            }
          ]
        },
        "help": {
          "type": "string"
        }
      }
    }
  },
  {
    type: 'output',
    id: "returnValidate",
    schema: {
      "type": "object",
      "properties": {
        "validateStatus": {
          "title": "校验状态",
          "type": "string",
          "description": "校验状态，成功/失败"
        },
        "help": {
          "title": "校验提示",
          "type": "string",
          "description": "帮助提示文案"
        }
      }
    }
  },
  {
    type: 'output',
    id: "setOptionsDone",
    schema: {
      "title": "输出数据源数据",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "title": "标签",
            "description": "选项标签（一般展示）",
            "type": "string"
          },
          "value": {
            "title": "值",
            "description": "选项值",
            "type": "string"
          }
        }
      }
    }
  },
  {
    type: 'output',
    id: "setValidateInfoDone",
    schema: {
      "type": "object",
      "properties": {
        "validateStatus": {
          "type": "enum",
          "descriptions": "校验状态，成功/失败",
          "items": [
            {
              "type": "string",
              "value": "success"
            },
            {
              "type": "string",
              "value": "error"
            }
          ]
        },
        "help": {
          "type": "string"
        }
      }
    }
  }
]
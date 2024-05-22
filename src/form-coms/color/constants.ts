export const descriptionUpList = [
  {
    type: "input",
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
    type: "output",
    id: "returnValidate",
    schema: {
      "type": "object",
      "properties": {
        "validateStatus": {
          "title": "校验状态",
          "description": "校验状态，成功/失败",
          "type": "string"
        },
        "help": {
          "title": "校验提示",
          "description": "帮助提示文案",
          "type": "string"
        }
      }
    }
  },
  {
    type: "output",
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
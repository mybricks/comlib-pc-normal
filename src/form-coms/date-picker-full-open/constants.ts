export const descriptionUpList = [
  {
    id: "setValidateInfo",
    type: "input",
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
    id: "returnValidate",
    type: "output",
    schema: {
      "type": "object",
      "properties": {
        "validateStatus": {
          "title": "校验状态",
          "description": "校验状态",
          "type": "string"
        },
        "help": {
          "title": "校验提示",
          "description": "校验提示",
          "type": "string"
        }
      }
    }
  },
  {
    id: "setValidateInfoDone",
    type: "output",
    schema: {
      "type": "object",
      "descriptions": "校验状态，成功/失败",
      "properties": {
        "validateStatus": {
          "type": "enum",
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
    id: "onPanelChange",
    type: "output",
    schema: {
      "type": "object",
      "properties": {
        "value": {
          "title": "日期",
          "description": "日期面板值",
          "type": "string"
        },
        "mode": {
          "title": "日期选择类型",
          "description": "日期选择类型，包括year、month、date等",
          "type": "string"
        }
      }
    }
  }
]
export const descriptionUpList = [
  {
    id: "setValue",
    type: "input",
    schema: {
      "type": "array",
      "description": "设置对应选中项的值",
      "items": {
        "type": "string"
      }
    }
  },
  {
    id: "setInitialValue",
    type: "input",
    schema: {
      "type": "array",
      "description": "设置对应选中项的初始值",
      "items": {
        "type": "string"
      }
    }
  },
  {
    id: "setOptions",
    type: "input",
    schema: {
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
          },
          "disabled": {
            "title": "禁用",
            "description": "选项禁用，true时禁用",
            "type": "boolean"
          },
          "checked": {
            "title": "选中",
            "description": "选项禁用，true时禁用",
            "type": "boolean"
          }
        }
      }
    }
  },
  {
    id: "setDynamicStyles",
    type: "input",
    schema: {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "value": {
            "type": "any",
            "description": "设置动态样式的对应选项值"
          },
          "style": {
            "type": "object",
            "description": "自定义样式"
          }
        }
      }
    }
  },
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
    id: "setOptionsDone",
    type: "output",
    schema: {
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
          },
          "disabled": {
            "title": "禁用",
            "description": "选项禁用，true时禁用",
            "type": "boolean"
          },
          "checked": {
            "title": "选中",
            "description": "选项禁用，true时禁用",
            "type": "boolean"
          }
        }
      }
    }
  },
  {
    id: "setValidateInfoDone",
    type: "output",
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
    id: "setOptionsDone",
    type: "output",
    schema: {
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
          },
          "disabled": {
            "title": "禁用",
            "description": "选项禁用，true时禁用",
            "type": "boolean"
          },
          "checked": {
            "title": "选中",
            "description": "选项禁用，true时禁用",
            "type": "boolean"
          }
        }
      }
    }
  }
]
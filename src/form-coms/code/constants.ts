import type { AceConfig } from './CodeEditor';
/**
 * 数据源
 * @param code 代码字符串
 * @param fieldName 字段名
 * @param language 代码语言
 * @param minLines 最小行数
 * @param maxLines 最大行数
 * @param wrap 是否自动换行
 * @param readOnly 是否只读
 * @param immediate 初始化后是否提交
 */
export interface Data {
  rules: any[]
  aceConfig: AceConfig;
  readOnly?: boolean;
}

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
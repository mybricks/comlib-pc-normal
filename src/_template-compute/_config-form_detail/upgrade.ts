export default function ({ input, output, data }): boolean {
  /**
   * @description v1.0.1->1.0.2 , setFormDetail 改变描述列表配置schema
   */
  const schema = {
    "type": "object",
    "properties": {
      "itemData": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "key": {
              "type": "string",
              "description": "字段名"
            },
            "value": {
              "type": "string",
              "description": "默认值"
            },
            "label": {
              "type": "string",
              "description": "标签名称"
            },
            "labelDesc": {
              "type": "string",
              "description": "描述项的标签说明信息、提示"
            },
            "showLabel": {
              "type": "boolean",
              "description": "是否展示标签"
            },
            "visible": {
              "type": "boolean",
              "description": "描述项是否可见"
            },
            "span": {
              "type": "number",
              "description": "范围是 1 到该行剩余column数"
            }
          }
        }
      },
      "title": {
        "type": "string",
        "description": "标题"
      },
      "showTitle": {
        "type": "boolean",
        "description": "展示标题"
      },
      "column": {
        "type": "number",
        "description": "描述列表的列数"
      }
    }
  }
  if (input.get("setFormDetail") && input.get("setFormDetail").schema !== schema) {
    input.get("setFormDetail").setSchema(schema)
  }
  
  return true;
}

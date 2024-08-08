export default function ({ input, output, slot, data }): boolean {
  const inputSchema = 
    {
      "title": "输入数据源",
      "name": "dataSource",
      "type": "array",
      "description": "每一项为文件类型的数据",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "excel文件名"
          },
          "uid": {
            "type": "number",
            "description": "文件唯一标识符"
          },
          "size": {
            "type": "number",
            "description": "文件大小"
          },
          "type": {
            "type": "string",
            "description": "文件类型"
          },
          "lastModified": {
            "type": "number",
            "description": "最后修改时间，时间戳"
          }
        }
      }
    }
  
  const origin = input.get('input.dataSource')
  if (input.get("input.dataSource") && input.get("input.dataSource").schema !== inputSchema) {
    input.get("input.dataSource").setSchema(inputSchema)
  }
  return true;
}

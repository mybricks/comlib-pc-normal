export default function ({
  id,
  data,
  slot,
  input,
  output,
  config,
  setDeclaredStyle,
  getDeclaredStyle,
  removeDeclaredStyle
}: UpgradeParams<any>): boolean {
  const exportComplete = output.get('exportComplete');
  if (!exportComplete) {
    output.add('exportComplete', '完成', { type: 'any' });
    input.get('dataSource').setRels(['exportComplete']);
  }

  /**
   * @description v1.0.3 -> v1.0.4 新增动态设置导出文件名、列宽配置
   */
  if (data.useDynamicFilename === undefined) {
    data.useDynamicFilename = false;
  }

  if (input.get('dataSource')) {
    const dataSourceSchema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          header: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          columns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                width: {
                  type: 'number'
                },
                hidden: {
                  type: 'boolean'
                }
              }
            }
          },
          data: {
            type: 'array',
            items: {
              type: 'object'
            }
          }
        }
      }
    };
    input.get('dataSource').setSchema(dataSourceSchema);
    input.get('dataSource').setId('input.dataSource');
    input.get('input.dataSource').setRels([]);
  }

  /**
   * @description v1.0.6 -> v1.0.7 增加description
   */

  const inputSchema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "表名称"
        },
        header: {
          type: "array",
          description: "表头",
          items: {
            type: "string"
          }
        },
        additionalInfo: {
          type: "object",
          description: "补充的描述性信息，可以指定内容加在第几行",
          properties: {
            data: {
              type: "array",
              items: {
                type: "string"
              }
            },
            rowIndex: {
              type: "number",
              description: "所在的行索引,从1开始(不超过excel内容行数),若设为1,将设置在标题行,header的内容会下移一行"
            }
          }
        },
        columns: {
          type: "array",
          description: "列配置",
          items: {
            type: "object",
            properties: {
              width: {
                type: "number",
                description: "列宽"
              },
              hidden: {
                type: "boolean",
                description: "列是否隐藏"
              }
            }
          }
        },
        data: {
          type: "array",
          description: "表数据",
          items: {
            type: "object"
          }
        }
      }
    }
  }

  const oldSchema = input.get("input.dataSource").schema;
  
  if(oldSchema !== inputSchema){
    input.get("input.dataSource").setSchema(inputSchema);
  }
  return true;
}

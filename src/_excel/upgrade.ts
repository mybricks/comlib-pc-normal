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

  return true;
}

import { Data } from './runtime';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if (!input.get('inputSettings')) {
    input.add('inputSettings', '初始化', {
      title: '排序数据',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          content: {
            title: '标题',
            type: 'string'
          },
          fieldName: {
            title: '字段名',
            type: 'string'
          },
          order: {
            title: '排序顺序',
            type: 'string'
          }
        }
      }
    });
  }

  // 补全 output => inputSettingsDone
  if (!output.get('inputSettingsDone')) {
    output.add('inputSettingsDone', '初始化完成', {
      title: '排序数据',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          content: {
            title: '标题',
            type: 'string'
          },
          fieldName: {
            title: '字段名',
            type: 'string'
          },
          order: {
            title: '排序顺序',
            type: 'string'
          }
        }
      }
    });
  }
  // 补全 rels => inputSettings-inputSettingsDone
  if (
    output.get('inputSettingsDone') &&
    input.get('inputSettings') &&
    !input.get('inputSettings')?.rels?.includes('inputSettingsDone')
  ) {
    input.get('inputSettings').setRels(['inputSettingsDone']);
  }

  return true;
}

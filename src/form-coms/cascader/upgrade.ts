import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    type: 'array',
  }

  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  //1.0.2->1.0.3 补全输入数据源结构
  input.get('setOptions').setSchema({
    title: '输入数据源数据',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        value: {
          title: '值',
          type: 'any'
        },
        label: {
          title: '名称',
          type: 'string'
        },
        disabled: {
          title: '禁用',
          type: 'boolean'
        },
        children: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object',
            properties: {}
          }
        }
      }
    }
  });
  return true;
}
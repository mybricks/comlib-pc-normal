import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  let valueSchema: {} = {
    type: 'string'
  };
  if (data.config.mode && ['multiple', 'tags'].includes(data.config.mode)) {
    valueSchema = data.config.labelInValue ? {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: {
            type: 'string'
          },
          value: {
            type: 'string'
          }
        }
      }
    } : {
      type: 'array'
    };
  } else {
    valueSchema = data.config.labelInValue ? {
      type: 'object',
      properties: {
        label: {
          type: 'string'
        },
        value: {
          type: 'string'
        }
      }
    } : {
      type: 'string'
    };
  }
  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }
  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  return true;
}
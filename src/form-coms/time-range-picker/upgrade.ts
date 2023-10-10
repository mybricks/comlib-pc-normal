import { InputIds, OutputIds } from '../types';
import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    type: 'array',
    items: {
      type: 'number'
    }
  };
  const baseType = data.format === 'timeStamp' ? 'number' : 'string';
  const returnValueSchema = data.outFormat === 'string'
    ? {
      type: 'string'
    }
    : {
      type: 'tuple',
      items: [
        {
          type: baseType
        },
        {
          type: baseType
        }
      ]
    };

  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '值初始化', valueSchema);
  }
  output.get('onInitial').setTitle('值初始化');

  /**
   * @description v1.1.0 新增自定义校验事件
   */

  if (!input.get(InputIds.SetValidateInfo)) {
    input.add(InputIds.SetValidateInfo, '设置校验状态', {
      type: 'object',
      properties: {
        validateStatus: {
          type: 'enum',
          items: [
            {
              type: 'string',
              value: 'success',
            },
            {
              type: 'string',
              value: 'error',
            },
          ],
        },
        help: {
          type: 'string',
        },
      },
    });
  }
  if (!output.get(OutputIds.OnValidate)) {
    output.add(OutputIds.OnValidate, '校验触发', returnValueSchema);
  }

  //=========== v1.1.0 end ===============

  return true;
}

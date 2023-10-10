import { Data } from './runtime';
import { ValidateTriggerType } from '../types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    "type": "string"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  /**
   * @description v1.0.11-1.1.0 新增自定义校验事件
   */

  if (!input.get('setValidateInfo')) {
    input.add('setValidateInfo', '设置校验状态', {
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
  if (!output.get('onValidate')) {
    output.add('onValidate', '校验触发', {
      type: 'string'
    });
  }

  if (!data.validateTrigger) {
    data.validateTrigger = [ValidateTriggerType.OnBlur];
  }

  return true;
}
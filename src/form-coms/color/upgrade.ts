import { Data } from './runtime';
import { ValidateTriggerType } from '../types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.7-1.1.0 新增自定义校验事件
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
    data.validateTrigger = [ ValidateTriggerType.OnPressEnter];
  }

  return true;
}

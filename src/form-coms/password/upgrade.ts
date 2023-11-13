import { Data } from './types';
import { ValidateTriggerType } from '../types';
import { RuleKeys } from '../utils/validator';
import { inputIds, outputIds } from '../form-container/constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    type: 'string'
  };

  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '值初始化', valueSchema);
  }
  output.get('onInitial').setTitle('值初始化');

  /**
   * @description v1.0.4, 新增按下回车事件
   */
  if (!output.get('onPressEnter')) {
    output.add('onPressEnter', '按下回车', valueSchema);
  }

  /**
   * @description v1.0.13-1.1.0 新增自定义校验事件
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
  const cutomRule = data.rules?.find(
    (i) => i.key === RuleKeys.CUSTOM_EVENT
  );
  if (data.rules?.length && !cutomRule) {
    data.rules.push({
      key: RuleKeys.CUSTOM_EVENT,
      status: false,
      visible: true,
      title: '自定义校验',
    });
  }

  /**
   * @description v1.1.1 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: "boolean"
    });
  }
  //=========== v1.1.1 end ===============

  return true;
}

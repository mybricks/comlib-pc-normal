import { inputIds, outputIds } from '../form-container/constants';
import { RuleKeys } from '../utils/validator';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.1.0 新增自定义校验事件
   */

  if (!input.get(inputIds.SET_VALIDATE_INFO)) {
    input.add(inputIds.SET_VALIDATE_INFO, '设置校验状态', {
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
  if (!output.get(outputIds.ON_VALIDATE)) {
    output.add(outputIds.ON_VALIDATE, '校验触发', {
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
  //=========== v1.1.0 end ===============

  return true;
}
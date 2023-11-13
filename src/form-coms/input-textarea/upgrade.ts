import { inputIds, outputIds } from '../form-container/constants';
import { InputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {

  if (typeof data.minRows === "undefined") {
    data.minRows = 3;
  };
  if (typeof data.maxRows === "undefined") {
    data.maxRows = 6;
  };

  const valueSchema = {
    "type": "string"
  }

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

  input.add(InputIds.SetColor, '设置字体颜色', { type: "string" });

  /**
   * @description v1.1.1 --> v1.1.2 新增回车事件
  */
  if(!output.get('onPressEnter')){
    output.add('onPressEnter', '按下回车', {
      type: 'string'
    })
  }
  //=========== v1.1.2 end ===============

  /**
   * @description v1.1.3 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: "boolean"
    });
  }
  //=========== v1.1.3 end ===============

  return true;
}
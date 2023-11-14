import { inputIds, outputIds } from '../form-container/constants';
import { ValidateTriggerType } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data } from './runtime';
import { InputIds } from '../types';

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

  if (!output.get('onPressEnter')) {
    output.add('onPressEnter', '按下回车', valueSchema);
  }

  /**
   * @description v1.0.9->v1.0.10 增加尺寸
   */
  if (typeof data.config.size === 'undefined') {
    data.config.size = 'middle';
  }

  /**
   * v1.2.11 -> v1.2.12 增加「设置字体颜色」能力
   */
  if (!input.get('setColor')) {
    input.add('setColor', '设置字体颜色', valueSchema);
  }

  /**
   * @description v1.2.13->v1.2.14 新增后缀图标, src——图标来源，innerIcon——内置图标
   */
  if (typeof data.src === 'undefined') {
    data.src = false;
  }
  if (typeof data.innerIcon === 'undefined') {
    data.innerIcon = "HomeOutlined";
  }

  /**
   * @description v1.3.0 新增自定义校验事件
   */

  if (!input.get(inputIds.SET_VALIDATE_INFO)) {
    input.add(inputIds.SET_VALIDATE_INFO, '设置校验结果', {
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

  //=========== v1.3.0 end ===============

  /**
   * @description v1.3.2 新增 校验触发时机 配置项
   */

  if (!data.validateTrigger) {
    data.validateTrigger = [ValidateTriggerType.OnBlur, ValidateTriggerType.OnPressEnter];
  }

  //=========== v1.3.2 end ===============

  input.add(InputIds.SetColor, '设置字体颜色', { type: "string" });

  /**
   * @description v1.3.3 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: "boolean"
    });
  }
  //=========== v1.3.3 end ===============

  return true;
}

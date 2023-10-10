import { InputIds, OutputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    type: 'array',
    items: {
      type: 'string'
    }
  }

  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  /**
    * @description v1.0.3 增加全选框配置
    */
  if (!data.checkAll) {
    data.checkAll = false;
  }
  if (!data.checkAllText) {
    data.checkAllText = '全选';
  }

  /**
   * @description v1.0.10->1.0.11 增加布局（水平或者垂直）
   */
  if (typeof data.layout === "undefined") {
    data.layout = "horizontal";
  };

  /**
   * @description v1.0.13 修复初始时的动态选项
   */
  if (data.config.options !== data.staticOptions) {
    data.config.options = data.staticOptions;
  };

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
    output.add(OutputIds.OnValidate, '校验触发', valueSchema);
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
import { inputIds, outputIds } from '../form-container/constants';
import { InputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data } from './runtime';

const valueSchema = {
  type: 'string'
};

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.3 统一“设置数据源”、“设置值”、“设置初始值”、“值初始化”的schema
  */
  const dataSourceSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        label: {
          title: '标签',
          type: 'string',
        },
        value: {
          title: '值',
          type: 'string',
        }
      },
    },
  };
  input.get('setOptions').setSchema(dataSourceSchema);

  data.staticOptions.map((item) => {
    if (!item.label) {
      item.label = item.value
    }
  })

  /**
    * @description v1.0.7->1.0.8 增加值选择
  */
  if (!output.get('onSelect')) {
    output.add('onSelect', '值选择', { type: "any" });
  }

  /**
   * v1.0.8 -> v1.0.9 增加「设置字体颜色」能力
   */
  if (!input.get('setColor')) {
    input.add('setColor', '设置字体颜色', valueSchema);
  }

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
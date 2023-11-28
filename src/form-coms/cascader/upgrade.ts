import { InputIds, OutputIds } from '../types';
import { inputIds, outputIds } from '../form-container/constants';
import { RuleKeys } from '../utils/validator';
import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    type: 'array',
  }

  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  //1.0.2->1.0.3 补全输入数据源结构
  input.get('setOptions').setSchema({
    title: '输入数据源数据',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        value: {
          title: '值',
          type: 'any'
        },
        label: {
          title: '名称',
          type: 'string'
        },
        disabled: {
          title: '禁用',
          type: 'boolean'
        },
        children: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object',
            properties: {}
          }
        }
      }
    }
  });

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
    output.add(OutputIds.OnValidate, '校验触发', {
      type: 'array',
      items: {
        type: 'string'
      }
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
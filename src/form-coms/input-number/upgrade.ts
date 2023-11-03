import { inputIds, outputIds } from '../form-container/constants';
import { RuleKeys } from '../utils/validator';
import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    "type": "number"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  //1.0.1 -> 1.0.2
  if (!output.get('onBlur')) {
    output.add('onBlur', '失去焦点', valueSchema);
  }
  if (!output.get('onPressEnter')) {
    output.add('onPressEnter', '按下回车', valueSchema);
  }

  /**
    * @description v1.0.10->1.0.11, 新增格式化展示
    */
  if (typeof data.isFormatter === "undefined") {
    data.isFormatter = false;
  }
  if (typeof data.charPostion === "undefined") {
    data.charPostion = "prefix"
  }
  if (typeof data.character === "undefined") {
    data.character = "¥"
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
      type: 'number'
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
   * @description v1.1.1 新增最大最小值配置
   */
  if(typeof data.isMax === "undefined"){
    data.isMax = false
  }
  if(typeof data.isMin === "undefined"){
    data.isMin = false
  }
  if(typeof data.max === "undefined"){
    data.max = 100
  }
  if(typeof data.min === "undefined"){
    data.min = 0
  }

  return true;
}
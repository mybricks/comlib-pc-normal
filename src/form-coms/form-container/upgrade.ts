import { Data } from './types';
import { inputIds, slotInputIds } from './constants'

export default function ({ data, input, output, slot }: UpgradeParams<Data>): boolean {
  if (!input.get(inputIds.SET_INITIAL_VALUES)) {
    const schema = {
      "type": "object",
      "properties": {}
    };

    input.add(inputIds.SET_INITIAL_VALUES, '设置表单数据', schema);
  }

  if (input.get(inputIds.SET_FIELDS_VALUE)) {
    input.get(inputIds.SET_FIELDS_VALUE).setTitle('设置表单数据（触发值变化）')
  }

  /**
   * @description v1.1.1 表单项/操作项增加宽度配置项
   */
  if (!data.actions.widthOption) {
    data.actions.widthOption = 'span';
  }
  data.items.forEach(item => {
    if (!item.widthOption) {
      item.widthOption = 'span'
      item.span = 24 / data.formItemColumn;
    }
  })

  /**
   * @description v1.1.2 , 新增子组件通知校验功能
   */
  if (!slot?.get('content')._inputs.get(slotInputIds.VALIDATE_TRIGGER)) {
    const validateTriggerSchema = {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "title": "组件ID"
        }
      }
    }
    slot?.get('content')._inputs.add(slotInputIds.VALIDATE_TRIGGER, '触发校验', validateTriggerSchema)
  }

  /**
   * @description v1.1.3 内联布局下，表单项/操作项增加边距配置项
   */
  data.items.forEach(item => {
    if (!item.inlineMargin) item.inlineMargin = [0, 16, 0, 0]
  });
  if (!data.actions.inlinePadding) data.actions.inlinePadding = [0, 0, 0, 0];

  return true;
}
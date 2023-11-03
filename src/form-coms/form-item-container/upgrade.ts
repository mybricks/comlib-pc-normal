import { inputIds, outputIds } from "../form-container/constants";
import { InputIds } from "../types";
import { RuleKeys } from "../utils/validator";
import { SlotIds, SlotInputIds, SlotOutputIds } from "./constants";

export default function ({ data, input, output, slot }: UpgradeParams<any>): boolean {
  const valueSchema = {
    type: "any"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', data.valueSchema || valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', data.valueSchema || valueSchema);
  }

  /**
   * @description v1.0.11: 增加设置禁用、设置启用输入项；作用域增加设置启用时、设置禁用时输出项
   */

  if (!data.childrenInputs) {
    data.childrenInputs = {};
  }

  const setDisabledPin = input.get(InputIds.SetDisabled);
  const setEnabledPin = input.get(InputIds.SetEnabled);
  if (!setDisabledPin) {
    input.add(InputIds.SetDisabled, '设置禁用', {
      type: 'any'
    });
  }
  if (!setEnabledPin) {
    input.add(InputIds.SetEnabled, '设置启用', {
      type: 'any'
    });
  }

  const formItemSlot = slot.get(SlotIds.FormItem);
  const onEnabled = formItemSlot.inputs.get('onEnabled');
  const onDisabled = formItemSlot.inputs.get('onDisabled');
  if (!onEnabled) {
    formItemSlot.inputs.add('onEnabled', '启用时', {
      type: 'any'
    });
  }
  if (!onDisabled) {
    formItemSlot.inputs.add('onDisabled', '禁用时', {
      type: 'any'
    });
  }

  //=========== v1.0.11 end ===============

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
    output.add(outputIds.ON_VALIDATE, '校验触发', data.valueSchema || valueSchema);
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
    * @description v1.1.1 增加作用域输入：设置表单项值
    */
  if (!slot.get(SlotIds.FormItem).outputs.get(SlotOutputIds.SetCurValue)) {
    slot.get(SlotIds.FormItem)
      .inputs.get(SlotInputIds.CurValue).setTitle('表单项值');
    slot.get(SlotIds.FormItem)
      .outputs.add(SlotOutputIds.SetCurValue, '设置表单项值', data.valueSchema || valueSchema);
  }
  //=========== v1.1.1 end ===============

  return true;
}
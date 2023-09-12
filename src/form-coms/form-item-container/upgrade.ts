import { InputIds } from "../types";
import { SlotIds } from "./constants";

export default function ({ data, input, output, slot }: UpgradeParams<any>): boolean {
    const valueSchema = {
        type: "any"
    }

    if (!input.get('setInitialValue')) {

        input.add('setInitialValue', '设置初始值', valueSchema);
    }

    if (!output.get('onInitial')) {
        output.add('onInitial', '初始化', valueSchema);
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
        formItemSlot.inputs.add('onEnabled', '设置启用时', {
            type: 'any'
        });
    }
    if (!onDisabled) {
        formItemSlot.inputs.add('onDisabled', '设置禁用时', {
            type: 'any'
        });
    }

    //=========== v1.0.11 end ===============

    return true;
}
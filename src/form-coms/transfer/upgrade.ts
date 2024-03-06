import { InputIds, OutputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data } from './types';
import { inputIds, outputIds } from '../form-container/constants';

export default function ({ data, input, output, style }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    type: 'array',
    items: {
      type: 'string'
    }
  };

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
        type: 'string',
      },
    });
  }
  const customRule = data.rules?.find(
    (i) => i.key === RuleKeys.CUSTOM_EVENT
  );
  if (data.rules?.length && !customRule) {
    data.rules.push({
      key: RuleKeys.CUSTOM_EVENT,
      status: false,
      visible: true,
      title: '自定义校验',
    });
  }
  //=========== v1.1.0 end ===============

  /**
   * @description v1.1.2 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: "boolean"
    });
  }
  //=========== v1.1.2 end ===============

  /**
   * @description v1.1.4 新增关联输出项
   */
  //1、设置数据源完成
  if (!output.get("setSourceDone")) {
    output.add("setSourceDone", '设置数据源完成', { type: 'number' });
  }
  if (output.get("setSourceDone") &&
    input.get("setSource") &&
    !input.get("setSource")?.rels?.includes("setSourceDone")) {
    input.get("setSource").setRels(["setSourceDone"]);
  }
  //2、设置值
  const initValueSchema = {
    "type": "array",
    "items": {
      "type": "string"
    }
  }
  if (!output.get(outputIds.setValueDone)) {
    output.add(outputIds.setValueDone, '设置值完成', initValueSchema);
  }
  if (output.get(outputIds.setValueDone) &&
    input.get(inputIds.setValue) &&
    !input.get(inputIds.setValue)?.rels?.includes(outputIds.setValueDone)) {
    input.get(inputIds.setValue).setRels([outputIds.setValueDone]);
  }
  //3、设置初始值
  if (!output.get(outputIds.setInitialValueDone)) {
    output.add(outputIds.setInitialValueDone, '设置初始值完成', initValueSchema);
  }
  if (output.get(outputIds.setInitialValueDone) &&
    input.get(inputIds.setInitialValue) &&
    !input.get(inputIds.setInitialValue)?.rels?.includes(outputIds.setInitialValueDone)) {
    input.get(inputIds.setInitialValue).setRels([outputIds.setInitialValueDone]);
  }
  //4、重置值
  if (!output.get(outputIds.resetValueDone)) {
    output.add(outputIds.resetValueDone, '重置完成', { type: "any" });
  }
  if (output.get(outputIds.resetValueDone) &&
    input.get(inputIds.resetValue) &&
    !input.get(inputIds.resetValue)?.rels?.includes(outputIds.resetValueDone)) {
    input.get(inputIds.resetValue).setRels([outputIds.resetValueDone]);
  }
  //5、设置禁用
  if (!output.get(outputIds.setDisabledDone)) {
    output.add(outputIds.setDisabledDone, '只读完成', { type: "any" });
  }
  if (output.get(outputIds.setDisabledDone) &&
    input.get(inputIds.SET_DISABLED) &&
    !input.get(inputIds.SET_DISABLED)?.rels?.includes(outputIds.setDisabledDone)) {
    input.get(inputIds.SET_DISABLED).setRels([outputIds.setDisabledDone]);
  }
  //6、设置启用
  if (!output.get(outputIds.setEnabledDone)) {
    output.add(outputIds.setEnabledDone, '启用完成', { type: "any" });
  }
  if (output.get(outputIds.setEnabledDone) &&
    input.get(inputIds.SET_ENABLED) &&
    !input.get(inputIds.SET_ENABLED)?.rels?.includes(outputIds.setEnabledDone)) {
    input.get(inputIds.SET_ENABLED).setRels([outputIds.setEnabledDone]);
  }
  //7、启用/禁用isEnable
  if (!output.get(outputIds.isEnableDone)) {
    output.add(outputIds.isEnableDone, '启用/只读完成', { type: "boolean" });
  }
  if (output.get(outputIds.isEnableDone) &&
    input.get(inputIds.IsEnable) &&
    !input.get(inputIds.IsEnable)?.rels?.includes(outputIds.isEnableDone)) {
    input.get(inputIds.IsEnable).setRels([outputIds.isEnableDone]);
  }
  //8、设置校验状态
  const infoSchema = {
    "type": "object",
    "properties": {
      "validateStatus": {
        "type": "enum",
        "items": [
          {
            "type": "string",
            "value": "success"
          },
          {
            "type": "string",
            "value": "error"
          }
        ]
      },
      "help": {
        "type": "string"
      }
    }
  }
  if (!output.get(outputIds.setValidateInfoDone)) {
    output.add(outputIds.setValidateInfoDone, '设置校验状态完成', infoSchema);
  }
  if (output.get(outputIds.setValidateInfoDone) &&
    input.get(inputIds.SET_VALIDATE_INFO) &&
    !input.get(inputIds.SET_VALIDATE_INFO)?.rels?.includes(outputIds.setValidateInfoDone)) {
    input.get(inputIds.SET_VALIDATE_INFO).setRels([outputIds.setValidateInfoDone]);
  }
  //=========== v1.1.4 end ===============

  if(!style.height){
    style.height = 'auto';
  }
  return true;
}

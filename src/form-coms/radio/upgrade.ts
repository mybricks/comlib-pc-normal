import { inputIds, outputIds } from '../form-container/constants';
import { InputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data } from './types';

export default function ({ data, input, output, getDeclaredStyle, setDeclaredStyle, removeDeclaredStyle }: UpgradeParams<Data>): boolean {
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
   * @description v1.0.11->1.0.12 增加布局（水平或者垂直）
   */
  if (typeof data.layout === "undefined") {
    data.layout = "horizontal";
  };

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
   * v1.1.0 -> v1.1.1 调整选项标签的样式优先级
   */

  const preLabelStyle = getDeclaredStyle("label.ant-radio-wrapper > span:nth-child(2)");
  if (preLabelStyle) {
    setDeclaredStyle("label.ant-radio-wrapper", preLabelStyle.css);
    removeDeclaredStyle("label.ant-radio-wrapper > span:nth-child(2)");
  }

  const preLabelDisableStyle = getDeclaredStyle("label.ant-radio-wrapper.ant-radio-wrapper-disabled > span:nth-child(2)");
  if (preLabelDisableStyle) {
    setDeclaredStyle("label.ant-radio-wrapper.ant-radio-wrapper-disabled", preLabelDisableStyle.css);
    removeDeclaredStyle("label.ant-radio-wrapper.ant-radio-wrapper-disabled > span:nth-child(2)");
  }

  input.add('setActiveFontColor', '设置激活选项字体的颜色', { type: "string" });

  /**
   * @description v1.1.3 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: "boolean"
    });
  }
  //=========== v1.1.3 end ===============

  /**
   * @description v1.1.5 关联输出项
   */
  //1、设置值
  if (!output.get(outputIds.setValueDone)) {
    output.add(outputIds.setValueDone, '设置值完成', { type: 'string' });
  }
  if (output.get(outputIds.setValueDone) &&
    input.get(inputIds.setValue) &&
    !input.get(inputIds.setValue)?.rels?.includes(outputIds.setValueDone)) {
    input.get(inputIds.setValue).setRels([outputIds.setValueDone]);
  }
  //2、设置初始值
  if (!output.get(outputIds.setInitialValueDone)) {
    output.add(outputIds.setInitialValueDone, '设置初始值完成', { type: 'string' });
  }
  if (output.get(outputIds.setInitialValueDone) &&
    input.get(inputIds.setInitialValue) &&
    !input.get(inputIds.setInitialValue)?.rels?.includes(outputIds.setInitialValueDone)) {
    input.get(inputIds.setInitialValue).setRels([outputIds.setInitialValueDone]);
  }
  //3、重置值
  if (!output.get(outputIds.resetValueDone)) {
    output.add(outputIds.resetValueDone, '重置完成', { type: "any" });
  }
  if (output.get(outputIds.resetValueDone) &&
    input.get(inputIds.resetValue) &&
    !input.get(inputIds.resetValue)?.rels?.includes(outputIds.resetValueDone)) {
    input.get(inputIds.resetValue).setRels([outputIds.resetValueDone]);
  }
  //4、设置数据源完成
  const arraySchema = {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "label": {
          "title": "标签",
          "type": "string"
        },
        "value": {
          "title": "值",
          "type": "any"
        },
        "disabled": {
          "title": "禁用",
          "type": "boolean"
        },
        "checked": {
          "title": "选中",
          "type": "boolean"
        }
      }
    }
  };
  if (!output.get("setOptionsDone")) {
    output.add("setOptionsDone", '设置数据源完成', arraySchema);
  }
  if (output.get("setOptionsDone") &&
    input.get("setOptions") &&
    !input.get("setOptions")?.rels?.includes("setOptionsDone")) {
    input.get("setOptions").setRels(["setOptionsDone"]);
  }

  //5、设置禁用
  if (!output.get(outputIds.setDisabledDone)) {
    output.add(outputIds.setDisabledDone, '禁用完成', { type: "any" });
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
    output.add(outputIds.isEnableDone, '启用/禁用完成', { type: "boolean" });
  }
  if (output.get(outputIds.isEnableDone) &&
    input.get(inputIds.IsEnable) &&
    !input.get(inputIds.IsEnable)?.rels?.includes(outputIds.isEnableDone)) {
    input.get(inputIds.IsEnable).setRels([outputIds.isEnableDone]);
  }
  //8、设置激活选项字体的颜色
  if (!output.get("setActiveFontColorDone")) {
    output.add("setActiveFontColorDone", '设置激活选项字体的颜色完成', { type: "boolean" });
  }
  if (output.get("setActiveFontColorDone") &&
    input.get("setActiveFontColor") &&
    !input.get("setActiveFontColor")?.rels?.includes("setActiveFontColorDone")) {
    input.get("setActiveFontColor").setRels(["setActiveFontColorDone"]);
  }
  //9、设置校验状态
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

  //=========== v1.1.5 end ===============

  /**
   * @description v1.1.8 新增 编辑/可读输入
   */
  if (!output.get(outputIds.isEditableDone)) {
    output.add(outputIds.isEditableDone, '设置编辑/只读完成', { type: 'boolean' });
  }
  if (!input.get(inputIds.isEditable)) {
    input.add(inputIds.isEditable, '设置编辑/只读', { type: 'boolean' });
    input.get(inputIds.isEditable).setRels([outputIds.isEditableDone]);
  }
  if (typeof data.isEditable === 'undefined') {
    data.isEditable = true;
  }
  //=========== v1.1.8 end ===============

  /**
   * @description v1.1.10 新增 data.autoFocus 自动聚焦配置项
   */
  if (data.autoFocus === undefined) {
    data.autoFocus = false;
  }
  //=========== v1.1.10 end ===============

  return true;
}
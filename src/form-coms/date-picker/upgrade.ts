import { InputIds, OutputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data } from './runtime';
import { inputIds, outputIds } from '../form-container/constants';

export default function ({
  data,
  input,
  output
}: UpgradeParams<Data>): boolean {
  //1.0.0 ->1.0.1，1.0.3->1.0.4
  //增加data.contentType, "timeStamp",
  //增加data.formatter, "YYYY-MM-DD HH:mm:ss 星期dd",
  if (typeof data.contentType === "undefined") {
    data.contentType = "timeStamp";
  };
  if (typeof data.formatter === "undefined") {
    data.formatter = "YYYY-MM-DD HH:mm:ss 星期dd";
  };

  //1.0.1 ->1.0.2
  const valueSchema = {
    "type": "string"
  }
  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }
  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  /**
   * @description v1.1.0 新增自定义校验事件
   */

  if (!input.get(InputIds.SetValidateInfo)) {
    input.add(InputIds.SetValidateInfo, '设置校验结果', {
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

  if (!input.get('disabledDate')) {
    input.add('disabledDate', '禁用特定日期', { type: "any" });
  }

  if (!input.get(InputIds.SetColor)) {
    input.add(InputIds.SetColor, '设置字体颜色', { type: "string" });
  }

  /**
   * @description v1.1.1->1.1.2 新增 显示清除图标、动态配置选择类型输入
   */
  if (typeof data.config.allowClear === "undefined") {
    data.config.allowClear = true;
  };

  const dateSchema = {
    type: "enum",
    items: [
      {
        type: "string",
        value: "date"
      },
      {
        type: "string",
        value: "week"
      },
      {
        type: "string",
        value: "month"
      },
      {
        type: "string",
        value: "quarter"
      },
      {
        type: "string",
        value: "year"
      }
    ]
  };
  if (!input.get('setDateType')) {
    input.add('setDateType', '设置日期选择类型', dateSchema);
  }
  //=========== v1.1.2 end ===============
  /**
   * @description v1.1.1 => v1.1.2 升级，新增 useCustomPanelHeader、useCustomPanelFooter 字段
   */
  if (!Reflect.has(data, 'useCustomPanelHeader')) data.useCustomPanelHeader = false;
  if (!Reflect.has(data, 'useCustomPanelFooter')) data.useCustomPanelFooter = false;
  if (!Reflect.has(data, 'controlled')) data.controlled = false;

  /**
   * @description v1.1.2 => v1.1.3 升级，新增 formatMap 字段
   */
  if (typeof data.formatMap === "undefined") {
    data.formatMap = {
      "日期": encodeURIComponent("YYYY-MM-DD"),
      "日期+时间": encodeURIComponent("YYYY-MM-DD HH:mm:ss"),
      "周": encodeURIComponent("YYYY-wo"),
      "月份": encodeURIComponent("YYYY-MM"),
      "季度": encodeURIComponent("YYYY-\\QQ"),
      "年份": encodeURIComponent("YYYY")
    }
  }

  /**
   * @description v1.1.3 => v1.1.4 升级，新增 isWeekNumber 字段
  */
  if (typeof data.isWeekNumber === "undefined") {
    data.isWeekNumber = false
  }

  /**
   * @description v1.1.4 => v1.1.5 升级，修改 setOpen 的文案
   */
  if (input.get("setOpen")?.title === "打开隐藏面板") {
    input.setTitle("setOpen", "打开日期选择面板");
  }

  if (typeof data.formatMap['日期+时间'] === "undefined") {
    data.formatMap = {
      "日期": data.formatMap['日期'],
      "日期+时间": encodeURIComponent("YYYY-MM-DD HH:mm:ss"),
      "周": data.formatMap['周'],
      "月份": data.formatMap['月份'],
      "季度": data.formatMap['季度'],
      "年份": data.formatMap['年份'],
    }
  }

  /**
   * @description v1.1.8 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: "boolean"
    });
  }
  //=========== v1.1.8 end ===============

  /**
   * @description v1.1.10 新增关联 输出项
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
  //4、设置禁用
  if (!output.get(outputIds.setDisabledDone)) {
    output.add(outputIds.setDisabledDone, '禁用完成', { type: "any" });
  }
  if (output.get(outputIds.setDisabledDone) &&
    input.get(inputIds.SET_DISABLED) &&
    !input.get(inputIds.SET_DISABLED)?.rels?.includes(outputIds.setDisabledDone)) {
    input.get(inputIds.SET_DISABLED).setRels([outputIds.setDisabledDone]);
  }
  //5、设置启用
  if (!output.get(outputIds.setEnabledDone)) {
    output.add(outputIds.setEnabledDone, '启用完成', { type: "any" });
  }
  if (output.get(outputIds.setEnabledDone) &&
    input.get(inputIds.SET_ENABLED) &&
    !input.get(inputIds.SET_ENABLED)?.rels?.includes(outputIds.setEnabledDone)) {
    input.get(inputIds.SET_ENABLED).setRels([outputIds.setEnabledDone]);
  }
  //6、启用/禁用isEnable
  if (!output.get(outputIds.isEnableDone)) {
    output.add(outputIds.isEnableDone, '启用/禁用完成', { type: "boolean" });
  }
  if (output.get(outputIds.isEnableDone) &&
    input.get(inputIds.IsEnable) &&
    !input.get(inputIds.IsEnable)?.rels?.includes(outputIds.isEnableDone)) {
    input.get(inputIds.IsEnable).setRels([outputIds.isEnableDone]);
  }
  //7、设置校验结果
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
    output.add(outputIds.setValidateInfoDone, '设置校验结果完成', infoSchema);
  }
  if (output.get(outputIds.setValidateInfoDone) &&
    input.get(inputIds.SET_VALIDATE_INFO) &&
    !input.get(inputIds.SET_VALIDATE_INFO)?.rels?.includes(outputIds.setValidateInfoDone)) {
    input.get(inputIds.SET_VALIDATE_INFO).setRels([outputIds.setValidateInfoDone]);
  }
  //8、禁用特定日期完成
  if (!output.get("disabledDateDone")) {
    output.add("disabledDateDone", "禁用特定日期完成", { type: "any" });
  }
  if (output.get("disabledDateDone") &&
    input.get("disabledDate") &&
    !input.get("disabledDate")?.rels?.includes("disabledDateDone")) {
    input.get("disabledDate").setRels(["disabledDateDone"]);
  }
  //9、设置字体颜色完成
  if (!output.get(outputIds.setColorDone)) {
    output.add(outputIds.setColorDone, '设置字体颜色完成', { type: "string" });
  }
  if (output.get(outputIds.setColorDone) &&
    input.get('setColor') &&
    !input.get('setColor')?.rels?.includes(outputIds.setColorDone)) {
    input.get('setColor').setRels([outputIds.setColorDone]);
  }
  //10、设置日期选择类型完成
  const typeSchema = {
    "type": "enum",
    "items": [
      {
        "type": "string",
        "value": "date"
      },
      {
        "type": "string",
        "value": "week"
      },
      {
        "type": "string",
        "value": "month"
      },
      {
        "type": "string",
        "value": "quarter"
      },
      {
        "type": "string",
        "value": "year"
      }
    ]
  };
  if (!output.get("setDateTypeDone")) {
    output.add("setDateTypeDone", "设置日期选择类型完成", typeSchema);
  }
  if (output.get("setDateTypeDone") &&
    input.get('setDateType') &&
    !input.get('setDateType')?.rels?.includes("setDateTypeDone")) {
    input.get('setDateType').setRels(["setDateTypeDone"]);
  }
  //=========== v1.1.10 end ===============

  /**
  * @description v1.1.15 新增 日期面板切换 输出项 
  */
  if (!output.get('onPanelChange')) {
    output.add('onPanelChange', '日期面板切换', {
      type: 'object',
      properties: {
        value: {
          title: '日期',
          type: 'string',
        },
        mode: {
          title: '日期选择类型',
          type: 'string',
        },
      },
    });
  }
  //=========== v1.1.15 end ===============

  /**
   * @description v1.3.16 新增 编辑/可读输入
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
  //=========== v1.3.16 end ===============

  return true;
}
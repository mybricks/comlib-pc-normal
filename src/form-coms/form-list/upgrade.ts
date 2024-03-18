import { inputIds, outputIds } from "../form-container/constants";
import { RuleKeys } from "../utils/validator";
import { getItemSchema } from "./schema";
import { SizeEnum } from "../types";
import { Data, LocationEnum, } from "./types";
import { InputIds as SelfInputIds } from './constants';

export default function ({ data, input, output, slot, setDeclaredStyle }: UpgradeParams<Data>): boolean {

  /**
   * @description v1.1.0
   */

  /** 1. 作用域支持添加自定义内容项组件 */
  if (!data.additionalItems) data.additionalItems = [];
  slot.get('formItems').setSchema([
    "mybricks.normal-pc.form-container/form-item",
    "mybricks.normal-pc.form-container/form-addition-container"
  ]);

  /** 2. 支持标题样式配置 */
  if (data.showLabel === undefined) {
    data.showLabel = data.items.some(item => item.hiddenLabel === false);
    data.labelWidth = 98;
    data.items.forEach(item => {
      if (item.showLabel === undefined) {
        if (item.hiddenLabel === true) {
          item.showLabel = 'default';
        } else {
          item.showLabel = true;
        }
      }
    });
  }

  /** 3. 支持操作项尺寸、图标、动态显隐配置 */
  data.actions.items.forEach(btn => {
    if (!btn.iconConfig) {
      btn.iconConfig = {
        src: false,
        size: [14, 14],
        gutter: 8,
        location: LocationEnum.FRONT
      }
    }
    if (btn.size === undefined) {
      btn.size = SizeEnum.Middle;
    }
    if (['add', 'remove'].includes(btn.key) && !btn.displayExpression) {
      if (btn.key === 'add') {
        btn.displayExpression = '{item.isLast}';
      }
      if (btn.key === 'remove') {
        btn.displayExpression = '{item.listLength !== 0}';
      }
    }
  });

  /** 4. 支持列表项样式配置 */
  if (!data.listItemMargin) {
    data.listItemMargin = [0, 0, 0, 0];
  }

  //=========== v1.1.0 end ===============

  //v1.1.0 -> v1.1.1 兼容操作按钮图标尺寸配置
  data.actions.items.forEach(btn => {
    if (btn.iconConfig.size && btn.iconConfig.size.length === 2) {
      setDeclaredStyle(
        `button[data-form-actions-item="${btn.key}"] .anticon`,
        { fontSize: `${Math.max(...btn.iconConfig.size)}px` }
      );
      setDeclaredStyle(
        `button[data-form-actions-item="${btn.key}"] .ant-image-img`,
        { width: `${btn.iconConfig.size[1]}px`, height: `${btn.iconConfig.size[0]}px` }
      );
      btn.iconConfig.size = [];
    }
  })

  /**
   * @description v1.2.0 新增自定义校验事件
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
    const valueSchema = {
      type: 'array',
      items: getItemSchema(data)
    };
    output.add(outputIds.ON_VALIDATE, '校验触发', valueSchema);
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
  //=========== v1.2.0 end ===============

  /**
   * @description v1.2.3 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: "boolean"
    });
  }
  //=========== v1.2.3 end ===============

  /**
   * @description v1.2.6 新增 添加一项、删除一项 输入项
   */
  if (!input.get(SelfInputIds.AddField)) {
    input.add(SelfInputIds.AddField, '新增一项', {
      type: 'object',
      properties: {
        index: {
          type: 'number',
        },
        value: {
          type: 'object',
        },
      },
    });
  }
  if (!input.get(SelfInputIds.RemoveField)) {
    input.add(SelfInputIds.RemoveField, '删除一项', {
      type: 'object',
      properties: {
        key: {
          type: 'number',
        },
        index: {
          type: 'number',
        },
      },
    });
  }
  //=========== v1.2.6 end ===============
  /* @description v1.2.7 新增关联输出项
   */
  //1、设置值
  const valueSchema = {
    "type": "array",
    "items": {
      "type": "object"
    }
  };
  if (!output.get(outputIds.setValueDone)) {
    output.add(outputIds.setValueDone, '设置值完成', valueSchema);
  }
  if (output.get(outputIds.setValueDone) &&
    input.get(inputIds.setValue) &&
    !input.get(inputIds.setValue)?.rels?.includes(outputIds.setValueDone)) {
    input.get(inputIds.setValue).setRels([outputIds.setValueDone]);
  }
  //2、设置初始值
  if (!output.get(outputIds.setInitialValueDone)) {
    output.add(outputIds.setInitialValueDone, '设置初始值完成', valueSchema);
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
    output.add(outputIds.setValidateInfoDone, '设置校验状态完成', infoSchema);
  }
  if (output.get(outputIds.setValidateInfoDone) &&
    input.get(inputIds.SET_VALIDATE_INFO) &&
    !input.get(inputIds.SET_VALIDATE_INFO)?.rels?.includes(outputIds.setValidateInfoDone)) {
    input.get(inputIds.SET_VALIDATE_INFO).setRels([outputIds.setValidateInfoDone]);
  }
  //8、添加一项
  const itemSchema = {
    "type": "object",
    "properties": {
      "index": {
        "type": "number"
      },
      "value": {
        "type": "object"
      }
    }
  };
  if (!output.get("addFieldDone")) {
    output.add("addFieldDone", '添加一项完成', itemSchema);
  }
  if (output.get("addFieldDone") &&
    input.get("addField") &&
    !input.get("addField")?.rels?.includes("addFieldDone")) {
    input.get("addField").setRels(["addFieldDone"]);
  }
  //9、删除一项
  if (!output.get("removeFieldDone")) {
    output.add("removeFieldDone", '删除一项完成', itemSchema);
  }
  if (output.get("removeFieldDone") &&
    input.get("removeField") &&
    !input.get("removeField")?.rels?.includes("removeFieldDone")) {
    input.get("removeField").setRels(["removeFieldDone"]);
  }
  //=========== v1.2.7 end ===============

  return true;
}
import { DateType, InputIds, OutputIds, TimeDateLimitItem } from '../types';
import { RuleKeys } from '../utils/validator';
import { refreshSchema } from './editors';
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
  const setValueSchema = {
    type: 'array',
    items: {
      type: 'string'
    }
  }
  const valueChangeSchema = {
    type: 'string'
  }
  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', setValueSchema);
  }
  if (!output.get('onInitial')) {
    output.add('onInitial', '值初始化', valueChangeSchema);
  }
  output.get('onInitial').setTitle('值初始化');

  /**
   * @description v1.0.4 增加禁用日期、时间配置项
   */
  const initDateRules: TimeDateLimitItem[] = [
    {
      title: '起始日期禁用',
      checked: true,
      type: DateType.Day as DateType,
      offset: 0,
      direction: 'before'
    },
    {
      title: '结束日期禁用',
      checked: true,
      type: DateType.Custom as DateType,
      offset: 0,
      direction: 'before'
    }
  ];
  const initTimeRules: TimeDateLimitItem[] = [
    {
      title: '起始时间禁用',
      checked: true,
      type: DateType.Second as DateType,
      offset: 0,
      direction: 'before'
    },
    {
      title: '结束时间禁用',
      checked: true,
      type: DateType.Custom as DateType,
      offset: 0,
      direction: 'before'
    }
  ];
  if (!data.staticDisabledDate) data.staticDisabledDate = initDateRules;
  if (!data.staticDisabledTime) data.staticDisabledTime = initTimeRules;

  /**
   * @description v1.0.10 增加 默认时间处理 配置项
   */
  if (!data.timeTemplate) {
    data.timeTemplate = ['current', 'current'];
  }

  /**
   * @description v1.0.11 增加 预设时间范围快捷选择 配置项
   */
  if (typeof data.useRanges === "undefined") {
    data.useRanges = false;
  };
  if (typeof data.ranges === "undefined") {
    data.ranges = [
      { title: "今天", type: "day", numList: [0, 0] },
      { title: "昨天", type: "day", numList: [1, -1] },
      { title: "明天", type: "day", numList: [-1, 1] },
      { title: "前后七天", type: "day", numList: [7, 7] },
      { title: "本周", type: "week", numList: [0, 0] },
      { title: "本月", type: "month", numList: [0, 0] }
    ];
  };

  /**
   * @description v1.0.13 fix: refreshSchema
   */
  if (output.get(OutputIds.ReturnValue)?.schema?.type !== 'tuple') {
    refreshSchema({ data, input, output });
  }

  /**
   * @description v1.0.16->1.0.17 增加 输出类型 配置项
   */
  if (typeof data.dateType === "undefined") {
    data.dateType = 'array';
  }
  if (typeof data.splitChart === "undefined") {
    data.splitChart = '-';
  }

  /**
   * @description v1.0.18->1.0.19 增加 allowEmpty, 允许起始项部分为空
  */
  if (typeof data.emptyRules === "undefined") {
    data.emptyRules = [];
  }

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
  const baseType = data.contentType === 'timeStamp' ? 'number' : 'string';
  const valueSchema = data.dateType === 'string'
    ? {
      type: 'string'
    }
    : {
      type: 'tuple',
      items: [
        {
          type: baseType
        },
        {
          type: baseType
        }
      ]
    };
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
  //1、设置值
  const initValueSchema = {
    "type": "tuple",
    "items": [
      {
        "type": "number"
      },
      {
        "type": "number"
      }
    ]
  };
  if (!output.get(outputIds.setValueDone)) {
    output.add(outputIds.setValueDone, '设置值完成', initValueSchema);
  }
  if (output.get(outputIds.setValueDone) &&
    input.get(inputIds.setValue) &&
    !input.get(inputIds.setValue)?.rels?.includes(outputIds.setValueDone)) {
    input.get(inputIds.setValue).setRels([outputIds.setValueDone]);
  }
  //2、设置初始值
  if (!output.get(outputIds.setInitialValueDone)) {
    output.add(outputIds.setInitialValueDone, '设置初始值完成', initValueSchema);
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
  //7、设置校验状态
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

  /**
   * @description v1.1.9 新增 编辑/可读输入
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
  //=========== v1.1.9 end ===============

  /**
   * @description v1.1.11 => v1.1.12 升级，新增 formatMap 字段
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

  return true;
}
import { InputIds, OutputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data } from './runtime';

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
    output.add(OutputIds.OnValidate, '校验触发', valueSchema);
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

  input.add(InputIds.SetColor, '设置字体颜色', { type: "string" });

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
  if(!Reflect.has(data, 'useCustomPanelHeader')) data.useCustomPanelHeader = false;
  if(!Reflect.has(data, 'useCustomPanelFooter')) data.useCustomPanelFooter = false;
  if(!Reflect.has(data, 'controlled')) data.controlled = false;

  /**
   * @description v1.1.2 => v1.1.3 升级，新增 formatMap 字段
   */
  if(typeof data.formatMap === "undefined"){
    data.formatMap = {
      "日期": encodeURIComponent("YYYY-MM-DD"),
      "周": encodeURIComponent("YYYY-wo"),
      "月份": encodeURIComponent("YYYY-MM"),
      "季度": encodeURIComponent("YYYY-\\QQ"),
      "年份": encodeURIComponent("YYYY")
    }
  }

  /**
   * @description v1.1.3 => v1.1.4 升级，新增 isWeekNumber 字段
  */
  if(typeof data.isWeekNumber === "undefined"){
    data.isWeekNumber = false
  }

  /**
   * @description v1.1.4 => v1.1.5 升级，修改 setOpen 的文案
   */
  if(input.get("setOpen")?.title === "打开隐藏面板" ) {
    input.setTitle("setOpen", "打开日期选择面板");
  }
  
  return true;
}
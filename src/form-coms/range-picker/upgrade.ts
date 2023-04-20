import { DateType, OutputIds, TimeDateLimitItem } from '../types';
import { refreshSchema } from './editors';
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
    output.add('onInitial', '初始化', valueChangeSchema);
  }

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

  return true;
}
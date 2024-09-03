export enum SlotIds {
  DateCell = 'dateCell',
  DatePanelHeader = 'datePanelHeader',
  DatePanelFooter = 'dataPanelFooter'
}

export enum InputIds {
  CurrentDate = 'currentDate',
  Today = 'Today',
  SetOpen = 'setOpen',
  ConfigExtraText = 'configExtraText'
}

export enum WeekDayEnum {
  //周日
  Sun = 'Sun',
  // 周一到周六
  Mon = 'Mon',
  Tue = 'Tue',
  Wed = 'Wed',
  Thu = 'thu',
  Fri = 'Fri',
  Sat = 'Sat'
}
// 星期枚举映射
export const WeekEnumMap = {
  [WeekDayEnum.Sun]: 0,
  [WeekDayEnum.Mon]: 1,
  [WeekDayEnum.Tue]: 2,
  [WeekDayEnum.Wed]: 3,
  [WeekDayEnum.Thu]: 4,
  [WeekDayEnum.Fri]: 5,
  [WeekDayEnum.Sat]: 6
};
// 季度枚举映射
export const QuarterEnumMap = {
  'Q1': 1,
  'Q2': 2,
  'Q3': 3,
  'Q4': 4
}

export const dateDisabledRulesSchema = {
  "type": "object",
  "properties": {
    "rules": {
      "type": "array",
      "descriptions": "禁用规则",
      "items": {
        "type": "object",
        "descriptions": "单条规则，数组内容，第一项为操作关系符号，如",
        "properties": {
          "value": {
            "title": "比较值",
            "description": "可以是字符或者数组，例如 `TODAY`、`2024-07-17` 可用在>=; ['2024-07-16', '2024-07-28']可用在in、between；'Sat'、'Mon',  用在equal场景",
            "type": "any"
          },
          "op": {
            "type": "enum",
            "title": "比较符号",
            "description": "比较操作，例如，>、>=、<= 具体日期，以及in、notIn区间包含关系；equal、notEqual特定日期（周六日、季度一二）；between 日期区间；complex 用于复杂场景，value可取{relation: '&&', rules: []}",
            "items": [
              {
                "type": "string",
                "value": ">"
              },
              {
                "type": "string",
                "value": ">="
              },
              {
                "type": "string",
                "value": "<"
              },
              {
                "type": "string",
                "value": "<="
              },
              {
                "type": "string",
                "value": "="
              },
              {
                "type": "string",
                "value": "in"
              },
              {
                "type": "string",
                "value": "notIn"
              },
              {
                "type": "string",
                "value": "equal"
              },
              {
                "type": "string",
                "value": "notEqual"
              },
              {
                "type": "string",
                "value": "between"
              },
              {
                "type": "string",
                "value": "complex"
              }
            ]
          }
        }
      }
    },
    "relation": {
      "type": "enum",
      "descriptions": "禁用规则中, 多项规则间关系；支持 && 和 || ，不传时默认为||",
      "items": [
        {
          "type": "string",
          "value": "&&"
        },
        {
          "type": "string",
          "value": "||"
        }
      ]
    },
    "picker": {
      "type": "enum",
      "description": "日期选择类型，非必填，不传时以组件配置的类型为准",
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
    }
  }
}

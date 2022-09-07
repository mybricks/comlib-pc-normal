export enum InputIds {
  DataSource = 'dataSource',

  CurrentDate = 'currentDate',
  CurrentDs = 'currentDs'
}
export enum OutputIds {
  ClickDate = 'clickDate',
  ClickMonth = 'clickMonth',
  MonthChange = 'monthChange',
  DateChange = 'dateChange',
  ModeChange = 'modeChange'
}
export enum SlotIds {
  DateCell = 'dateCell',
  HeaderRender = 'headerRender'
}

export const Schemas = {
  Any: {
    type: 'any'
  },
  String: {
    type: 'string'
  },
  DateSchema: {
    type: 'object',
    properties: {
      mode: {
        type: 'string' // 'month' | 'year'
      },
      dataSource: {
        type: 'array',
        items: {
          type: 'any'
        }
      },
      date: {
        type: 'string'
      }
    }
  },
  MonthSchema: {
    type: 'object',
    properties: {
      mode: {
        type: 'string' //'month' | 'year'
      },
      date: {
        type: 'string'
      },
      month: {
        type: 'string'
      },
      dataSource: {
        type: 'array',
        items: {
          type: 'any'
        }
      },
      firstDate: {
        type: 'string'
      },
      lastDate: {
        type: 'string'
      }
    }
  },
  CurrentDs: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        content: {
          type: 'string'
        },
        color: {
          type: 'string'
        }
      }
    }
  }
};

export enum ModeEnum {
  Month = 'month',
  Year = 'year',
  Date = 'date'
}

/**
 * 数据源
 * @param mode 默认展示模式
 * @param useCustomDateCell 日期内容插槽
 * @param useCustomHeader 顶部插槽
 * @param useModeSwitch 年/月切换
 * @param useMonthSelect 月份切换
 * @param useYearSelect 年份切换
 *
 * @param useClickDateEvent 是否使用 点击日期单元格 事件
 * @param useClickMonthEvent 是否使用 点击月份单元格 事件
 * @param useDateChangeEvent 是否使用 日期变化 事件
 * @param useMonthChangeEvent 是否使用 月份变化 事件
 * @param useModeChangeEvent 是否使用 年/月面板切换 事件
 */
export interface Data {
  mode: 'month' | 'year';
  useCustomDateCell?: boolean;
  useCustomHeader?: boolean;
  useModeSwitch: boolean;
  useMonthSelect: boolean;
  useYearSelect: boolean;

  useClickDateEvent: boolean;
  useClickMonthEvent: boolean;
  useDateChangeEvent: boolean;
  useMonthChangeEvent: boolean;
  useModeChangeEvent: boolean;
}

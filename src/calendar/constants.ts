export enum INPUTS {
  DataSource = 'dataSource'
}
export enum OUTPUTS {
  ClickDate = 'clickDate',
  ClickMonth = 'clickMonth',
  MonthChange = 'monthChange',
  DateChange = 'dateChange',
  ModeChange = 'modeChange'
}
export enum SLOTS {
  DateCell = 'dateCell',
  HeaderRender = 'headerRender'
}
export const DateSchema = {
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
};
export const MonthSchema = {
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
};

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

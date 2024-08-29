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
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '日历',
    usage: `data声明
mode: 'month' | 'year' = "month"
useCustomDateCell?: boolean = false
useCustomHeader?: boolean = false
useModeSwitch: boolean = true
useYearSelect: boolean = true
useMonthSelect: boolean = true
useClickDateEvent: boolean = false
useClickMonthEvent: boolean = false
useDateChangeEvent: boolean = false
useMonthChangeEvent: boolean = false
useModeChangeEvent: boolean = false

slots插槽
dateCell: 开启日期内容插槽后的日期插槽内容

styleAry声明
无`
  }
}
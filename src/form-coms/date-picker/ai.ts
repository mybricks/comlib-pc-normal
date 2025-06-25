export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '日期选择框',
    usage: `data声明
options: any[] = []
rules: any[] = []
showTime: Record<string, unknown> | boolean = false
useCustomDateCell: boolean = false
showNow?: boolean = true
contentType: string = "timeStamp"
formatter: string = "YYYY-MM-DD HH:mm:ss 星期dd"
config: antd.DatePickerProps = {
  "disabled": false,
  "placeholder": "请选择日期",
  "picker": "date",
  "allowClear": true,
  "size": "middle"
}
isWeekNumber: boolean = false
customExtraText: boolean = false
isEditable: boolean = true

slots插槽
dateCell: 日期展示区内容
datePanelHeader: 面板顶部区内容
dataPanelFooter: 面板底部区内容

styleAry声明
文本内容: .ant-picker-input>input
提示内容: input::placeholder
清除按钮: .anticon-close-circle
选择框: .ant-picker
日历图标: .anticon-calendar
今天按钮: .ant-picker-today-btn
确认按钮: .ant-btn-primary
日期单元格: .ant-picker-cell
`
  }
}

// [TODO-AI] styleAry声明
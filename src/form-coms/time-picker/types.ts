import { TimePickerProps } from "antd"

export interface Data {
  placeholder?: string
  disabled?: boolean
  showNow?: boolean
  disabledTimeRules: any[],
  rules: any[],
  format: string,
  customFormat: string,
  isEditable: boolean,
  config: TimePickerProps
}

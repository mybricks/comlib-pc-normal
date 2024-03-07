import { TimePickerProps } from "antd"

export interface Data {
  placeholder?: string
  disabled?: boolean
  rules: any[],
  format: string,
  customFormat: string,
  isEditable: boolean,
  config: TimePickerProps
}

import { TimeRangePickerProps } from "antd"

export interface Data {
  placeholder: [string, string]
  disabled?: boolean
  rules: any[],
  format: string,
  customFormat: string,
  outFormat: 'array' | 'string',
  splitChar: string,
  isEditable: boolean,
  config: TimeRangePickerProps
}

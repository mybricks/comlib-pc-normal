import { InputProps } from "antd";

export interface Data {
  placeholder?: string
  disabled?: boolean
  rules: any[]
  validateTrigger: string[];
  config: InputProps
}

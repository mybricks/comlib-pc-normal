export interface Data {
  placeholder?: [string, string]
  disabled?: boolean
  rules: string[],
  format: string,
  customFormat: string,
  outFormat: 'array' | 'string',
  splitChar: string
}

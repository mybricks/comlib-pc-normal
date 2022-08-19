export interface Data {
  items: any[]
  isFormItem: boolean
  dataType: 'object' | 'list'
}

export interface FormControlProps {
  com: any
  value?: string | number
  onChange?: (value: string | number | undefined) => void
}

export type FormControlInputId = 'validate' | 'getValue' | 'setValue'
export interface Data {
  items: any[]
  isFormItem: boolean
  dataType: 'object' | 'list'
  layout: 'horizontal' | 'vertical' | 'inline'
}

export interface FormControlProps {
  com: any
  value?: string | number
  onChange?: (value: string | number | undefined) => void
  field?: any
}

export type FormControlInputId = 'validate' | 'getValue' | 'setValue'
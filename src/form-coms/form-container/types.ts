import { ButtonType } from 'antd/es/button/button'
interface Action {
  title: string
  loading?: boolean
  isDefault: boolean
  outputId: string
  type?: ButtonType
  key: string
  visible?: boolean
}

interface Actions {
  items: Action[];
  visible: boolean;
}

export interface Data {
  items: any[]
  isFormItem: boolean
  dataType: 'object' | 'list'
  layout: 'horizontal' | 'vertical' | 'inline'
  fieldsLength?: number
  actions: Actions
}

export interface FormControlProps {
  com: any
  value?: string | number
  onChange?: (value: string | number | undefined) => void
  field?: any
}

export type FormControlInputId = 'validate' | 'getValue' | 'setValue' | 'resetValue'


export type LayoutModel = "inline" | "row" | "column";
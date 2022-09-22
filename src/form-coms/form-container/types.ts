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
  span: number;
  visible: boolean;
}

interface FormItems {
  id: string; 
  name: string
  label: string
  span: number
  required?: boolean
}

export type LabelWidthType = 'px' | 'span'

export interface Data {
  items: FormItems[]
  isFormItem: boolean
  formItemColumn: number
  dataType: 'object' | 'list'
  layout: 'horizontal' | 'vertical' | 'inline'
  fieldsLength?: number
  actions: Actions
  labelWidthType: LabelWidthType
  labelWidth: number
  labelCol: number
  wrapperCol: number
}

export interface FormControlProps {
  com: any
  value?: string | number
  onChange?: (value: string | number | undefined) => void
  field?: any
}

export type FormControlInputId = 'validate' | 'getValue' | 'setValue' | 'resetValue'


export type LayoutModel = "inline" | "row" | "column";
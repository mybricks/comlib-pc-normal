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
  widthOption: LabelWidthType;
  width: number;
  span: number;
  visible: boolean;
  align: 'left' | 'center' | 'right';
  inlinePadding?: number[]
}

interface FormItems {
  id: string;
  name: string
  label: string
  span: number
  required?: boolean
  visible: boolean
  validateStatus?: string
  help?: string
  tooltip?: string
  widthOption: LabelWidthType
  inlineMargin?: number[]
}

export type LabelWidthType = 'px' | 'span'

export interface Data {
  /**
   * 表单项列表
   */
  items: FormItems[]
  /**
   * 是否作为表单项
   */
  isFormItem: boolean
  /**
   * 单行列数
   */
  formItemColumn: number
  /**
   * 数据类型
   */
  dataType: 'object' | 'list'
  /**
   * 布局类型
   */
  layout: 'horizontal' | 'vertical' | 'inline'
  fieldsLength?: number
  /**
   * 操作项
   */
  actions: Actions
  /**
   * 标题宽度类型
   */
  labelWidthType: LabelWidthType
  /**
   * 标题宽度
   */
  labelWidth: number
  /**
   * 标题宽度占比
   */
  labelCol: number
  wrapperCol: number

  /**
   * 合并参数 Schema
   */
  paramsSchema: any

  submitHiddenFields: boolean
}

export interface FormControlProps {
  com: any
  value?: string | number
  onChange?: (value: string | number | undefined) => void
  field?: any
}

export type FormControlInputId = 'validate' | 'getValue' | 'setValue' | 'resetValue' | 'setInitialValue'


export type LayoutModel = "inline" | "row" | "column";
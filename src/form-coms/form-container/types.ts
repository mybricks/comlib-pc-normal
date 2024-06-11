import { FormProps } from 'antd'
import { ButtonType } from 'antd/es/button/button'
import { CSSProperties } from 'react'
export interface Action {
  title: string
  loading?: boolean
  isDefault: boolean
  outputId: string
  type?: ButtonType
  key: string
  visible?: boolean
  danger?: boolean
  permission?: {
    id: string
    type?: string
  },
  useDynamicHidden: boolean;
  useDynamicDisabled: boolean;
  disabled: boolean;

  useIcon: boolean;
  iconLocation: 'front' | 'back';
  icon: string;
  iconDistance: number;
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

export interface FormItems {
  id: string;
  comName: string
  name: string
  label: string
  span: number
  required?: boolean
  colon?: FormItemColonType
  visible: boolean
  validateStatus?: string
  help?: string
  tooltip?: string
  labelStyle?: {}
  labelWidthType?: 'custom' | 'default'
  labelWidth?: number
  labelAlign?: 'left' | 'right' | 'default'
  labelAutoWrap?: boolean | 'default'
  hiddenLabel?: boolean
  description?: string
  descriptionStyle?: {}
  widthOption: LabelWidthType
  width: number
  inlineMargin?: number[]
  slotAfter?: string
  disabled?: boolean
  /**
   * 表单项收起时隐藏，不影响提交数据
   */
  hidden?: boolean
  /** @description 标题插槽ID v1.4.44 */
  labelSlot?: string
}

export interface AdditionalItem {
  id: string;
  comName: string
  name: string
  span: number
  widthOption: LabelWidthType
  width: number
  visible: boolean
}

export type LabelWidthType = 'px' | 'span' | 'flexFull'

export interface Data {

  /**
   * 表单类型 普通表单、查询表单
   */
  layoutType: 'Form' | 'QueryFilter'

  /**
   * 表单项列表
   */
  items: FormItems[]
  /**
   * 非表单项列表
   */
  additionalItems: AdditionalItem[]
  /**
   * 是否作为表单项
   */
  isFormItem: boolean
  /**
   * 单行列数
   */
  formItemColumn: number
  /**
   * 启用24栅格布局，启用后，可设置表单项宽度；查询表单使用
   */
  enable24Grid?: boolean
  // /**
  //  * 数据类型
  //  */
  // dataType: 'object' | 'list'
  /**
   * 布局类型
   */
  layout?: 'horizontal' | 'vertical' | 'inline'

  // fieldsLength?: number
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
   * 标题是否展示冒号
   */
  colon: boolean | undefined
  /**
   * 表单原生属性
   */
  config: FormProps

  /**
   * 表单项可编辑/只读
   */
  isEditable: boolean

  /**
   * 合并参数 Schema
   */
  paramsSchema: any

  /**
   *  提交隐藏表单项
   */
  submitHiddenFields: boolean

  /**
   *  隐藏表单项字段是否校验
   */
  validateHiddenFields: boolean


  /**
  *  绑定的领域模型数据
  */
  domainModel: DomainModel

  /**
   * 表单项 24栅格宽度
   */
  span?: number

  /*
  * 默认状态下是否折叠超出的表单项
  */
  defaultCollapsed: boolean

  useDynamicItems?: boolean
}

interface DomainModel {
  // formValues: any
  entity?: any
  queryFieldRules: QueryFieldRules
  isQuery?: boolean
  type?: string
}

interface QueryFieldRules {
  [field: string]: {
    operator: string
  }
}

export interface FormControlProps {
  com: any
  value?: string | number
  onChange?: (value: string | number | undefined) => void
  field?: any
  index?: number
}

export type FormControlInputId = 'validate' | 'getValue' | 'setValue' | 'resetValue' | 'setInitialValue' | 'setDisabled' | 'setEnabled'

export type LayoutModel = "inline" | "row" | "column";

export type FormItemColonType = true | false | "default";

export enum LocationEnum {
  FRONT = 'front',
  BACK = 'back'
}


export interface DynamicItemData {
  name: string
  relOriginField: string
  label: string
  common?: {
    labelAlign?: 'left' | 'right' | 'default'
    labelAutoWrap?: boolean | 'default'
    description?: string
    labelStyle?: CSSProperties
    descriptionStyle?: CSSProperties
    tooltip?: string
    disabled?: boolean
    required?: boolean
  }
}

import { FormItemProps, FormListFieldData, FormProps } from 'antd'
import { ButtonType } from 'antd/es/button/button'
import { ValidateInfo } from '../types'
export interface Action {
  title: string
  loading?: boolean
  isDefault: boolean
  outputId: string
  type?: ButtonType
  key: string
  visible?: boolean
  danger?: boolean
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
  labelAlign?: 'left' | 'right' | 'default'
  labelAutoWrap?: boolean | 'default'
  hiddenLabel?: boolean
  description?: string
  descriptionStyle?: {}
  widthOption: LabelWidthType
  width: number
  inlineMargin?: number[]
  slotAfter?: string
}


export type LabelWidthType = 'px' | 'span' | 'flexFull'

export interface Data {
  value: any[] | undefined;
  /**
   * 列表数据
   */
  fields: FormListFieldData[]
  /**
   * 列表当前最大key
   */
  MaxKey: number
  /**
   * 校验规则
   */
  rules: any[];
  /**
   * 表单项列表
   */
  items: FormItems[]
  /**
   * 列表初始长度
   */
  initLength: number
  /**
   * 当前触发的输入项id
   */
  currentAction: string;
  /**
   * 需要初始化的列表项起始索引值
   */
  startIndex: number;
  /**
   * 是否提交隐藏表单项
   */
  submitHiddenFields: boolean
  /**
   * 是否禁用
   */
  disabled: boolean
  /**
   * 是否作为表单项
   */
  isFormItem: boolean
  /**
   * 单行列数
   */
  formItemColumn: number
  /**
   * 插槽样式
   */
  slotStyle: {}
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
   * 表单项公共配置
   */
  formItemConfig: FormItemProps
}

export type FormControlInputId = 'validate' | 'getValue' | 'setValue' | 'resetValue' | 'setInitialValue' | 'setDisabled' | 'setEnabled'

export type FormItemColonType = true | false | "default";

export type FormControlInputRels = {
  validate: (val?: any) => {
    returnValidate: (cb: (val: ValidateInfo) => void) => void;
  };
  getValue: (val?: any) => {
    returnValue: (val) => {};
  };
  [key: string]: (val?: any) => void;
};

export type FormControlInputType = {
  inputs: {
    [key in FormControlInputId]: FormControlInputRels[key];
  };
  index: number;
  visible: boolean;
};
export type ChildrenStore = {
  [key: number | string]: {
    [id: string]: FormControlInputType
  };
}
import { FormItemProps, FormListFieldData, FormProps } from 'antd'
import { ButtonType } from 'antd/es/button/button'
import { ValidateInfo } from '../types'

export type IconSrcType = false | 'custom' | 'inner';

export interface Action {
  title: string
  loading?: boolean
  isDefault: boolean
  outputId: string
  type?: ButtonType
  key: string
  visible?: boolean
  danger?: boolean
  size: SizeEnum
  /** 动态显示表达式 */
  displayExpression?: string
  /** 图标配置 */
  iconConfig: {
    // 图标来源
    src: IconSrcType;
    // 图标尺寸
    size: [number, number];
    // 图标与文字的间隔
    gutter: number;
    // 内置图标
    innerIcon?: string;
    // 自定义图标
    customIcon?: string;
    // 图标位置
    location: LocationEnum;
  }

}

interface Actions {
  items: Action[];
  widthOption: LabelWidthType;
  width: number;
  span: number;
  visible: boolean;
  align: 'left' | 'center' | 'right';
  inlinePadding?: number[],
}

export interface FormItems {
  id: string;
  name: string
  comName: string
  schema: {}
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
  showLabel: boolean | 'default'
  description?: string
  descriptionStyle?: {}
  widthOption: LabelWidthType
  width?: number
  inlineMargin?: number[]
  slotAfter?: string
}

export interface AdditionalItem {
  id: string;
  comName: string
  span: number
  widthOption: LabelWidthType
  width?: number
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
   * 表单项数目
   */
  nameCount: number
  /**
   * 校验规则
   */
  rules: any[];
  /**
   * 表单项列表
   */
  items: FormItems[];
  /**
   * 非表单项列表
   */
  additionalItems: AdditionalItem[];
  /**
   * 列表初始长度
   */
  initLength: number
  /**
   * 用户操作
   */
  userAction: {
    type: string;
    index?: number;
    value?: {};
    startIndex: number;
  }
  /**
   * 需要初始化的列表项索引
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
   * 显示标题
   */
  showLabel: boolean
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
  /**
   * 列表项外边距
   */
  listItemMargin: number[]
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

/** 按钮尺寸 */
export enum SizeEnum {
  Large = 'large',
  Middle = 'middle',
  Small = 'small'
}

/** 按钮图标位置 */
export enum LocationEnum {
  FRONT = 'front',
  BACK = 'back'
}
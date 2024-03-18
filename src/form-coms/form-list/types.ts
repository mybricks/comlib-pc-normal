import { FormItemProps, FormListFieldData, FormProps } from 'antd'
import { ButtonType } from 'antd/es/button/button'
import { ValidateInfo, SizeEnum } from '../types'

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
  /** @description 动态显示表达式 */
  displayExpression?: string
  /** @description 图标配置 */
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
  /** @description 权限配置 */
  permission?: {
    id: string,
    type?: string;
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
   * @description 列表数据
   */
  fields: FormListFieldData[]
  /**
   * @description 列表当前最大key
   */
  MaxKey: number
  /**
   * @description 表单项数目
   */
  nameCount: number
  /**
   * @description 校验规则
   */
  rules: any[];
  /**
   * @description 表单项列表
   */
  items: FormItems[];
  /**
   * @description 非表单项列表
   */
  additionalItems: AdditionalItem[];
  /**
   * @description 列表初始长度
   */
  initLength: number
  /**
   * @description 用户操作
   */
  userAction: {
    type: string;
    index: number;
    key: React.Key;
    value?: {};
    startIndex: number;
  }
  /**
   * @description 需要初始化的列表项索引
   */
  startIndex: number;
  /**
   * @description 是否提交隐藏表单项
   */
  submitHiddenFields: boolean
  /**
   * @description 是否禁用
   */
  disabled: boolean
  /**
   * @description 是否作为表单项
   */
  isFormItem: boolean
  /**
   * @description 单行列数
   */
  formItemColumn: number
  /**
   * @description 插槽样式
   */
  slotStyle: {}
  /**
   * @description 操作项
   */
  actions: Actions
  /**
   * @description 显示标题
   */
  showLabel: boolean
  /**
   * @description 标题宽度类型
   */
  labelWidthType: LabelWidthType
  /**
   * @description 标题宽度
   */
  labelWidth: number
  /**
   * @description 标题宽度占比
   */
  labelCol: number
  wrapperCol: number
  /**
   * @description 标题是否展示冒号
   */
  colon: boolean | undefined
  /**
   * @description 表单项公共配置
   */
  formItemConfig: FormItemProps
  /**
   * @description 列表项外边距
   */
  listItemMargin: number[]
  /**
   * @description 表单项尺寸
   */
  size: 'small' | 'middle' | 'large'
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

/** @description 按钮图标位置 */
export enum LocationEnum {
  FRONT = 'front',
  BACK = 'back'
}
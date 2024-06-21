export interface StepItem {
  id: string;
  title: string;
  description: string;
  subTitle?: string;
  index: number;
  useDynamicDisplay?: boolean;
  hide?: boolean;
  content?: any;
  render?: boolean;
  useCustomDesc?: boolean;
  useIcon?: boolean;
  customIcon?: boolean;
  icon?: string;
  iconSrc?: string;
  iconSize?: [number, number];
}

export type BtnType = 'cancel' | 'previous' | 'next' | 'submit';

export type Btn = { label: string; value: BtnType; visible: boolean };

type ExtraBtn = {
  id: string;
  type: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed';
  text: string;
};

interface Toolbar {
  submit: boolean;
  actionAlign?: string;
  /** v1.0.27废弃 */
  primaryBtnText?: string;
  /** v1.0.27废弃 */
  secondBtnText?: string;
  /** v1.0.27废弃 */
  submitText?: string;
  showActions: boolean;
  btns: Array<Btn>;
  extraBtns?: Array<ExtraBtn>;
  fixed?: boolean;
  bottom?: number;
}

interface Steps {
  size: 'small' | 'default';
  type: 'default' | 'navigation' | 'dotted';
  showDesc: boolean;
  direction?: 'horizontal' | 'vertical';
  canClick?: boolean;
}

/**
 * 数据源
 */
export interface Data {
  steps: Steps;
  current: number;
  stepAry: StepItem[];
  toolbar: Toolbar;
  fullSubmit: boolean;
  useSubmitBtnLoading: boolean;
  hideSlots?: boolean;
  dynamicSteps?: boolean;
}

export const INTO = '_into';
export const LEAVE = '_leave';
export const CLICK = '_click';

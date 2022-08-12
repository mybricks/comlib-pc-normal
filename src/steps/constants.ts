export interface StepItem {
  id: string;
  title: string;
  description: string;
  subTitle?: string;
  index: number;
  useDynamicDisplay?: boolean;
  hide?: boolean;
  content?: any;
}

interface Toolbar {
  showDesc: number;
  size: "small" | "default";
  type: "default" | "navigation" | "dotted";
  submit: boolean;
  reset: boolean;
  showSecondBtn: boolean;
  actionAlign?: string;
  showActions?: boolean;
  primaryBtnText?: string;
  secondBtnText?: string;
  resetText?: string;
  submitText?: string;
}
/**
 * 数据源
 */
export class Data {
  current: number;
  stepAry: StepItem[];
  toolbar: Toolbar;
  fullSubmit: boolean;
  useSubmitBtnLoading: boolean;
  hideSlots?: boolean;
  direction?: 'horizontal' | 'vertical'
}

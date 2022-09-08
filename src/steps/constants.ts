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

export type ToolbarType = 'default' | 'custom' | 'never'
interface Toolbar {
  type: ToolbarType
  submit: boolean;
  showSecondBtn: boolean;
  actionAlign?: string;
  primaryBtnText?: string;
  secondBtnText?: string;
  submitText?: string;

}

interface Steps {
  size: "small" | "default";
  type: "default" | "navigation" | "dotted";
  showDesc: boolean;
  direction?: 'horizontal' | 'vertical'
}


/**
 * 数据源
 */
export class Data {
  steps: Steps
  current: number;
  stepAry: StepItem[];
  toolbar: Toolbar;
  fullSubmit: boolean;
  useSubmitBtnLoading: boolean;
  hideSlots?: boolean;
}

type ValidateStatus = 'success' | 'error'

export interface ValidateInfo {
  validateStatus: ValidateStatus
  help?: string
}

export interface Option {
  label: string;
  value: string;
  children?: Option[];
  key?: string | number;
  disabled?: boolean;
  checked: boolean;
  _id?: string;
}

export const InputIds = {
  SetValue: 'setValue',
  SetInitialValue: 'setInitialValue',
  ResetValue: 'resetValue',
  SetDisabled: 'setDisabled',
  SetEnabled: 'setEnabled',
  SetValidateInfo: 'setValidateInfo',
  SetColor: 'setColor',
  SetDynamicStyles: 'setDynamicStyles',
}

export const OutputIds = {
  OnChange: 'onChange',
  OnBlur: 'onBlur',
  OnInitial: 'onInitial',
  ReturnValue: 'returnValue',
  OnValidate: 'onValidate',
  SetDynamicStylesDone: 'setDynamicStylesDone',
}

export type DateType = "custom" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";

export type PickerComponentType = 'DatePicker' | 'RangePicker' | 'TimePicker' | 'TimeRangePicker';
export interface TimeDateLimitItem {
  title: string;
  checked: boolean;
  type: DateType;
  offset: number;
  direction: 'before' | 'after'
}

export const DateType = {
  Custom: "custom",
  Second: "seconds",
  Minute: "minutes",
  Hour: "hours",
  Day: "days",
  Week: "weeks",
  Month: "months",
  Year: "years",
};

export const ValidateTriggerType = {
  OnInit: "onInit",
  OnChange: "onChange",
  OnBlur: "onBlur",
  OnPressEnter: "onPressEnter",
};

/**@description 组件尺寸分类 */
export enum SizeEnum {
  "Small" = "small",
  "Middle" = "middle",
  "Large" = "large"
};

/**@description 组件尺寸的选项 */
export const SizeOptions = [
  {
    label: '小',
    value: SizeEnum.Small
  },
  {
    label: '默认',
    value: SizeEnum.Middle
  },
  {
    label: '大',
    value: SizeEnum.Large
  },
]
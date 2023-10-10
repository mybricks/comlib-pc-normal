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
}

export const InputIds = {
  SetValue: 'setValue',
  SetInitialValue: 'setInitialValue',
  ResetValue: 'resetValue',
  SetDisabled: 'setDisabled',
  SetEnabled: 'setEnabled',
  SetValidateInfo: 'setValidateInfo',
  SetColor: 'setColor'
}

export const OutputIds = {
  OnChange: 'onChange',
  OnBlur: 'onBlur',
  OnInitial: 'onInitial',
  ReturnValue: 'returnValue',
  OnValidate: 'onValidate'
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
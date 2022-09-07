type ValidateStatus = 'success' | 'error'

export interface ValidateInfo {
  validateStatus: ValidateStatus
  help?: string
}

export interface Option {
  label: string;
  value: string;
  children?: Option[];
  key: string | number;
  disabled?: boolean;
  checked: boolean;
}

export const InputIds = {
  SetValue: 'setValue'
}

export const OutputIds = {
  OnChange: 'onChange',
  ReturnValue: 'returnValue'
}
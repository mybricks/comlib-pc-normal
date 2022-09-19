export enum TypeEnum {
  info = 'info',
  error = 'error',
  success = 'success',
  warning = 'warning',
  confirm = 'confirm'
}
export const TypeEnumMap = {
  [TypeEnum.success]: '成功',
  [TypeEnum.error]: '错误',
  [TypeEnum.info]: '信息',
  [TypeEnum.warning]: '警告',
  [TypeEnum.confirm]: '确认'
};
export interface Data {
  type: TypeEnum;
  title: string;
  content: string;
  okText: string;
  cancelText: string;
  showTitle?: boolean;
  showCancelBtn?: boolean;
  width?: number;
  outputValue?: any;
}

export const InputIds = {
  Open: 'open'
};
export const OutputIds = {
  Ok: 'ok',
  Cancel: 'cancel'
};
export const Schemas = {
  Any: {
    type: 'any'
  },
  Follow: {
    type: 'follow'
  }
};

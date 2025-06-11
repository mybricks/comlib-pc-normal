export enum TypeEnum {
  info = 'info',
  error = 'error',
  success = 'success',
  warning = 'warning',
  confirm = 'confirm'
}

export enum ClassTypeEnum {
  // mobileWrap = 'mobileWrap',
  darkModalWrap = 'darkModalWrap',
  modalWrap = 'modalWrap',
}

export const ClassTypeEnumMap ={
  // [ClassTypeEnum.mobileWrap]: '移动端弹窗',
  [ClassTypeEnum.modalWrap]: '默认弹窗',
  [ClassTypeEnum.darkModalWrap]: ' BMS主题弹窗',
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
  closable: boolean;
  useIcon: boolean;
  iconName: string;
  className: string;
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

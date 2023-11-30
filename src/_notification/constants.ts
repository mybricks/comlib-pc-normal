export interface Data {
  type: TypeEnum;
  showTitle: boolean;
  message: string;
  description: string;
  duration: number | null;
  placement: PlacementEnum; // 弹出位置
  top: number;
  bottom: number;
}

export enum PlacementEnum {
  top = 'top',
  bottom = 'bottom',
  topLeft = 'topLeft',
  topRight = 'topRight',
  bottomLeft = 'bottomLeft',
  bottomRight = 'bottomRight'
}

export const OutputIds = {
  Close: 'close'
};

export const InputIds = {
  Open: 'open'
};

export enum TypeEnum {
  info = 'info',
  error = 'error',
  success = 'success',
  warning = 'warning'
}

export const TypeEnumMap = {
  [TypeEnum.success]: '成功',
  [TypeEnum.error]: '错误',
  [TypeEnum.info]: '信息',
  [TypeEnum.warning]: '警告'
};

export const Schemas = {
  Any: {
    type: 'any'
  },
  Follow: {
    type: 'follow'
  }
};

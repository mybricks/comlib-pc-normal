export enum TypeEnum {
  success = 'success',
  error = 'error',
  info = 'info',
  warning = 'warning',
  loading = 'loading'
}
export const TypeEnumMap = {
  [TypeEnum.success]: '成功',
  [TypeEnum.error]: '失败',
  [TypeEnum.info]: '信息',
  [TypeEnum.warning]: '警告',
  [TypeEnum.loading]: '等待'
};

/**
 * 数据源
 * @param title 名称
 * @param content 提示内容
 * @param type 提示类型
 * @param duration 关闭延时
 */
export interface Data {
  title: string;
  content?: string;
  type: TypeEnum;
  duration: number;
}

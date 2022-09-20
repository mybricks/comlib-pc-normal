// 路由类型枚举
export enum TypeEnum {
  PUSHSTATE = 'pushState',
  RELOAD = 'reload',
  // REPLACESTATE = 'replaceState',
  BACK = 'back',
  FORWARD = 'forward',
  REDIRECT = 'redirect',
  OPENTAB = 'openTab',
  OPENWINDOW = 'openWindow'
}
export const TypeEnumMap = {
  [TypeEnum.PUSHSTATE]: '路由跳转',
  [TypeEnum.RELOAD]: '刷新',
  [TypeEnum.BACK]: '返回',
  [TypeEnum.FORWARD]: '前进',
  [TypeEnum.REDIRECT]: '重定向',
  [TypeEnum.OPENTAB]: '新标签页',
  [TypeEnum.OPENWINDOW]: '新窗口'
};
/**
 * 数据源
 * @param type 类型
 */
export interface Data {
  type: TypeEnum;
  url?: string;
  title?: string;
}

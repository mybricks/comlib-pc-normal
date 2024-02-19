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
 * @param useDynamic 使用动态配置
 * @param url 默认链接
 * @param title 默认窗口名称
 */
export interface Data {
  type: TypeEnum;
  useDynamic?: boolean;
  url?: string;
  title?: string;
}

export const InputIds = {
  RouterAction: 'routerAction'
};
export const OutputIds = {
  RouterActionDone: 'routerActionDone'
};
export const Schemas = {
  String: {
    type: 'string'
  },
  Any: {
    type: 'any'
  }
};

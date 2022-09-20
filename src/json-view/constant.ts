export enum TypeEnum {
  Key = 'key',
  Number = 'number',
  Bracket = 'bracket',
  String = 'string',
  Object = 'object',
  Boolean = 'boolean',
  Null = 'null',
  Undefined = 'undefined',
  Function = 'function'
}

/**
 * 数据源
 * @param json json数据
 * @param colors 不同类型对应的颜色
 * @param collapsed 默认展开深度
 * @param collapseStringsAfterLength 属性值最大长度
 * @param displayObjectSize 是否展示条目
 * @param enableClipboard 节点复制
 * @param enableOutput 节点输出
 * @param dataSourceType 数据源类型
 */
export interface Data {
  json: any;
  colors: {
    [K in TypeEnum]: string;
  };
  collapsed: number;
  collapseStringsAfterLength: number;
  displayObjectSize: boolean;
  enableClipboard: boolean;
  enableOutput: boolean;
  dataSourceType?: 'default' | 'array' | 'object';
}

export const InputIds = {
  SetJsonData: 'jsonData'
};
export const OutputIds = {
  Select: 'nodeData'
};
export const Schemas = {
  Any: {
    type: 'any'
  }
};

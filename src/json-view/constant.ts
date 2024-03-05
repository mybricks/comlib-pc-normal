export enum TypeEnum {
  Key = 'key',
  Number = 'number',
  Bracket = 'bracket',
  String = 'string',
  Object = 'object',
  Boolean = 'boolean',
  Null = 'null',
  Undefined = 'undefined',
  Function = 'function',
  BackgroundColor = 'backgroundColor',
  NodeHoverBackgroundColor = 'nodeHoverBackgroundColor',
}

/**
 * 数据源
 * @param json json数据/静态json编码字符串
 * @param jsonObj json数据转化的JSON对象
 * @param colors 不同类型对应的颜色
 * @param collapsed 默认展开深度
 * @param collapseStringsAfterLength 属性值最大长度
 * @param displayObjectSize 是否展示条目
 * @param enableClipboard 节点复制
 * @param copyValueWithLabel 节点复制输出键值对
 * @param enableOutput 节点输出
 * @param dataSourceType 数据源类型
 */
export interface Data {
  json: any;
  jsonObj: { [propName: string]: any } | any[];
  colors: {
    [K in TypeEnum]: string;
  };
  collapsed: number;
  collapseStringsAfterLength: number;
  displayObjectSize: boolean;
  enableClipboard: boolean;
  copyValueWithLabel: boolean;
  enableOutput: boolean;
  dataSourceType: 'default' | 'array' | 'object';
  /**@description 字符串节点的值复制时，是否包含引号 */
  copyStringWithQuotation: boolean;
}

export const InputIds = {
  SetJsonData: 'jsonData',
  GetJsonData: 'getJsonData',
  SetExpandDepth: 'setExpandDepth'
};
export const OutputIds = {
  Select: 'nodeData',
  JsonData: 'jsonData'
};
export const Schemas = {
  Any: {
    type: 'any'
  }
};
export const dataSourceTypeMap = {
  'default': [],
  'array': [],
  'object': {},
}

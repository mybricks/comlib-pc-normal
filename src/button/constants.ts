/**
 * 数据源
 * @param text 文字标题
 * @param asMapArea 作为热区使用
 * @param style 样式
 * @param dataType 样式
 * @param outVal 触发数据
 * @param inVal external触发数据
 */
export interface Data {
  text: string;
  style?: any;
  asMapArea?: boolean;
  dataType: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external';
  outVal: any;
  inVal: any;
}

export const OutputIds = {
  Click: 'click',
  DbClick: 'dbClick'
}

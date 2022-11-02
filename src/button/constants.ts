/**
 * 数据源
 * @param text 文字标题
 * @param asMapArea 作为热区使用
 * @param style 样式
 * @param dataType 类型
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

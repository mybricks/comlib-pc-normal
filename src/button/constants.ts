/**
 * 数据源
 * @param text 文字标题
 * @param asMapArea 作为热区使用
 * @param style 样式
 */
export interface Data {
  text: string;
  style?: any;
  asMapArea?: boolean;
}

export const OutputIds = {
  Click: 'click',
  DbClick: 'dbClick'
}

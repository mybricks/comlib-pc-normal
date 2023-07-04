/**
 * 数据源
 * @param text 文字标题
 * @param asMapArea 作为热区使用
 * @param style 样式
 * @param dataType 样式
 * @param outVal 触发数据
 * @param inVal external触发数据
 * @param useIcon 使用图标
 * @param icon 图标
 * @param src 图片地址
 * @param contentSize 图片或者图标尺寸
 * @param showText 显示文本
 * @param iconLocation 图标位置
 * @param iconDistance 图标和文本的间距位置
 */
export interface Data {
  text: string;
  style?: any;
  asMapArea?: boolean;
  dataType: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external';
  outVal: any;
  inVal: any;
  useIcon: boolean;
  isCustom: boolean; 
  icon: string;
  src: string;
  contentSize: number[];
  showText: boolean;
  iconLocation: 'front' | 'back',
  iconDistance: number
}

export const OutputIds = {
  Click: 'click',
  DbClick: 'dbClick'
}

export enum LocationEnum {
  FRONT = 'front',
  BACK = 'back'
}
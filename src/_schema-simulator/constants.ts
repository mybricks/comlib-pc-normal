/**
 * 数据源
 * @param arrLength 数组长度
 * @param strLength 字符串长度
 * @param numberRange 数字范围
 */
 export interface Data {
  arrLength: number;
  strLength: number;
  numberRange: [number, number];
  outSchema: any;
}
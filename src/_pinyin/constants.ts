/**
 * 数据源
 * @param valType 数据类型
 * @param splitChart 分隔符
 */
export interface Data {
  valType: 'firstLetter' | 'pinyinArr' | 'pinyinStr';
  splitChart: string
}

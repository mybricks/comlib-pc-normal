import type { AceConfig } from './CodeEditor';
/**
 * 数据源
 * @param code 代码字符串
 * @param fieldName 字段名
 * @param language 代码语言
 * @param minLines 最小行数
 * @param maxLines 最大行数
 * @param wrap 是否自动换行
 * @param readOnly 是否只读
 * @param immediate 初始化后是否提交
 */
export interface Data {
  rules: any[]
  aceConfig: AceConfig;
  readOnly?: boolean;
}

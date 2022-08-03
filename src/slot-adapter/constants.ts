/**
 * 数据源
 * @param
 */
export class Data {
  sourceSlotKey: string;
  targetSlotKey: string;
  adapterCode: string;
}

// 默认代码注释
export const defaultCodeAnnotation = `/**
* @param props 父级插槽传入的数据
* @param context 内置方法
*        context.callService(serviceId, {}) => Promise<any> 发送网络请求
*        context.utils 工具方法
*        context.util.getCookies
*        context.util.getParams
*        context.util.isCommaNumber
*        context.util.isEmailPrefix
*        context.util.isNumber
*        context.util.isUrl
*        context.util.numToPercent
* @return 返回给当前插槽的数据
*
* 例子
* export default function ({ props, context }) {
*    return props;
* }
*/`;
// 默认代码
export const defaultCode = `
export default function ({ props, context }) {
  return props;
}
`;

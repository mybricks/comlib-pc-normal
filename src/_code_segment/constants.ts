export const CODE_TEMPLATE = `
export default function ({ inputValue, outputs }, context) {
  outputs['output0'](inputValue);
}`;

export const COMMENTS = `/**
* @param inputValue: any 输入项的值
* @parma outputs: any 输出项
* @param context: ContextProps 内置方法
* outputs['output0'](val: any) => void 输出项函数
*
* interface Utils {
*   // 获取cookies
*   getCookies: () => object;
*   // 日期格式化方法，例如: context.utils.moment().format('YYYY-MM-DD')
*   moment: (params:any) => any;
* }
* interface ContextProps {
*   // 发送网络请求
*   callService: (serviceId: string, params: Object) => Promise<any>;
*   // 获取URL参数
*   getQuery: () => object;
*   // i18n方法
*   i18n: (str: string) => string;
*   // 工具方法
*   utils: Utils
* }
* 例子
* export default function ({ inputValue, outputs }, context) {
*   // 获取输出项函数
*   const out0 = outputs['output0'];
*     
*   // 多输出的情况
*   // const out1 = outputs['output1'];
*   // const out2 = outputs['output2'];
*   // const out[n] = outputs['outputn'];
*   
*   const res = '该值输出给下一个组件使用' + inputValue
*   
*   // 向输出项（output0）输出结果
*   out0(res); 
* }
*/`;

export interface Data {
  fns: string | {
    code: string;
    transformCode: string
  };
  runImmediate: boolean;
}

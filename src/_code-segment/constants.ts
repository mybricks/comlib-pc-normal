export const CODE_TEMPLATE = `({ context, inputValue, outputs }) => {
  const { output0 } = outputs;
  output0(inputValue);
}`;

export const COMMENTS = `/**
* @param inputValue: any 输入项的值
* @parma outputs: any 输出项
* @param context: ContextProps 内置方法
*
* interface Utils {
*   // 获取cookies
*   getCookies: () => object;
*   // 日期格式化方法，例如: context.utils.moment().format('YYYY-MM-DD')
*   moment: (params:any) => any;
* }
* interface ContextProps {
*   // 获取URL参数
*   getQuery: () => object;
*   // i18n方法
*   i18n: (str: string) => string;
*   // 工具方法
*   utils: Utils
* }
* 例子
* ({ context, inputValue, outputs }) => {
*   const { output0, output1, output2 } = outputs;
*   const res = '该值输出给下一个组件使用' + inputValue
*   
*   // 向输出项（output0）输出结果
*   output0(res); 
*   
*   // 多输出的情况
*   // output1(res); 
*   // output2(res); 
* }
*/`;

export interface Data {
  transformCode: string;
  fnParams: string[];
  fnBody: string;
  fns: any;
  runImmediate: boolean;
}

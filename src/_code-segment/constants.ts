export const CODE_TEMPLATE = `({ inputValue, outputs }) => {
  const { output0 } = outputs;
  output0(inputValue);
}`;

export const COMMENTS = `/**
* @param inputValue: any 输入项的值
* @parma outputs: any 输出项
*
* 例子
* ({ inputValue, outputs }) => {
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

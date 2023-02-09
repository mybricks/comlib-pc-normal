export const CODE_TEMPLATE = `({ inputValue, outputs, inputs }) => {
  const { output0 } = outputs;
  output0(inputValue);
}`;

export const IMMEDIATE_CODE_TEMPLATE = `({ outputs }) => {
  const { output0 } = outputs;
  output0(0);
}`;

export const COMMENTS = `/**
* @param inputValue: any 输入项的值
* @parma outputs: any 输出项
* @parma inputs: any 输入项
*
* 例子
* ({ inputValue, outputs, inputs }) => {
*   const { inputValue0, inputValue1, inputValue2 } = inputs;
*   const { output0, output1, output2 } = outputs;
*   const res = '该值输出给下一个组件使用' + inputValue
*   
*   // 向输出项（output0）输出结果
*   output0(res); 

*   // 多输出的情况
*   // 向输出项（output1）输出输入项0的值
*   // output1(inputValue0); 
*   // 向输出项（output2）输出输入项1的值
*   // output2(inputValue1); 
* }
*/`;

export interface Data {
  transformCode: string;
  fnParams: string[];
  fnBody: string;
  fns: any;
  runImmediate: boolean;
}

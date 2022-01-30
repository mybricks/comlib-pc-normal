export const CODE_TEMPLATE = `
export default function ({ inputValue, outputs }, context) {
    outputs['output0'](inputValue);
}`;

export const COMMENTS = `/**
* inputValue: any 输入项的值
* outputs.output0(val: any) => void 输出项函数
* context.callService(serviceId, {}) => Promise<any> 发送网络请求
*
* 例子
* export default function ({ inputValue, outputs }, context) {
*   // 获取输出项函数
*   const out0 = outputs.output0;
*     
*   // 多输出的情况
*   // const out1 = outputs.output1;
*   // const out2 = outputs.output2;
*   // const out[n] = outputs.output[n];
*   
*   const res = '该值输出给下一个组件使用' + inputValue
*   
*   // 向输出项（output0）输出结果
*   out0(res); 
* }
*/`;

export interface Data {
  fns: string;
  runImmediate: boolean;
}

export const Comment = `
 interface env {
   // ajax网络请求
   ajax: Fetch;
   // 发送网络请求
   callService: (serviceId: string, params: Object) => Promise<any>;
   // vars内置方法
   vars: {
    // 获取URL参数
     getQuery: () => object;
   }
 }
 interface Context {
   //React
   React: React;
   // antd组件库
   antd: antd;
   //antd icons
   icons: @ant-design/icons;
   //组件环境方法
   env: env
 }
 /**
  * @param props 组件数据
  * @param context 上下文（包含React，antd，icons等）
  * @param events 事件输出
  * @return 自定义渲染
  */
 ({ props, context, events }) => {
    const { React, antd, icons } = context;
    const { Button } = antd
    const { RightOutlined } = icons;
    const onClick = function () {
       events['output0'](value)
    }
    return (
       <div>
         <Button type="primary" onClick={onClick}>demo按钮<RightOutlined /></Button>
       </div>
    );
 }
`;

export const DefaultCode = `({ props, context, events }) => {
  return <div>自定义渲染</div>;
}`;

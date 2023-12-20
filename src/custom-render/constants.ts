export const Comments = `
 interface Inject {
   //React
   React: React;
   // antd组件库
   antd: antd;
   //antd icons
   icons: @ant-design/icons;
 }
 /**
  * @param props 组件数据
  * @param inject 注入对象（包含React，antd，icons等）
  * @param events 事件输出
  * @return 自定义渲染
  */
 ({ props, inject, events }: Params) => {
    const { React, antd, icons } = inject;
    const { Button } = antd
    const { RightOutlined } = icons;
    const [num, setNum] = React.useState(0)
    const onClick = function () {
      setNum(pre => pre + 1)
      //  events['output0']()
    }
    return (
       <div>
        <Button type="primary" onClick={onClick}>按钮<RightOutlined /></Button>
        <h3>按钮被点击了\{num}次</h3>
        <h3>props</h3>
        <div dangerouslySetInnerHTML={{__html: JSON.stringify(props??{}, null, 2)}}/>
       </div>
    );
 }
`;

export const DefaultCode = `({ props, inject, events }: Params) => {
  const style = {
    padding: '8px 12px',
    borderRadius: 8,
    backgroundColor: 'rgba(246, 247, 249, 0.5)'
  }
  return <div style={style}>自定义渲染</div>;
}`;

const ReactType =  `\/\/\/ <reference types="https://unpkg.com/browse/@types/react@17.0.73/index.d.ts" />`

export const getParamsType = (propsTypeName: string = 'any') =>  `
declare interface Params = {
  props: ${propsTypeName};
  inject: {
    React: typeof React;
    antd: Record<string, any>;
    icons: Record<string, any>;
  };
  events: Record<string, Function>
}
`

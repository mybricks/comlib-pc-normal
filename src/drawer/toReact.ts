import { Location } from './constants';
import {  getPropsFromObject, } from '../utils/toReact';

let iconArr:any = [];
export default function ({ data, slots, style }) {
  const renderDrawer = (
    data,
    env,
    slots,
  ) => {
    const children = slots['content']?.render({});
    
    let footerStr = data.footerBtns.map((item:any)=>{
      const { title, id, showText, icon, useIcon, location, isConnected, outputDs, ...res } = item;
      if(item.icon!== undefined || ''){
        iconArr.push(item.icon)
      }

      return (
          `<Button
            style={${JSON.stringify({
              marginLeft: '8px'
            })}}
            ${getPropsFromObject(res)}
          >
          ${item.useIcon && item.location !== Location.BACK ? `<${item.icon}/>`: '' }
          ${item.showText ? `${item.title}`: ''  }
          ${item.useIcon && item.location === Location.BACK ? `<${item.icon}/>`: ''  }
        </Button>`
      )
    })

    footerStr = `<div>
                  ${footerStr}
                </div>`.replace(',','')

    return `
      <Drawer
      maskClosable={${data.maskClosable || true}}
      mask={${data.showMask}}
      title={${JSON.stringify(data.title)}}
      placement='${data.position}'
      visible={false}
      width={${data.width}}
      height={${data.height}}
      bodyStyle={${JSON.stringify(data.bodyStyle)}}
      footerStyle={${JSON.stringify({
        display: 'flex',
        justifyContent: `${data.footerAlign}`
      })}}
      ${data.useFooter ? `footer={${footerStr}}` : ''}
      >
        ${children=== undefined ? '' : children }
      </Drawer>`;
  };

  let str = renderDrawer(data, slots, style);

  function unique (arr) {
    return Array.from(new Set(arr))
  };
  iconArr = unique(iconArr);
  iconArr = iconArr.filter(Boolean);
  
  return {
    imports: [
      {
        from: 'antd',
        coms: ['Drawer','Button']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      },
      {
        from: '@ant-design/icons',
        coms: [ ...iconArr ]
      },
    ],
  	jsx: str,
    style: '',
    js: ''
  }
}
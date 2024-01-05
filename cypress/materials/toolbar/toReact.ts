import { LocationEnum } from './types';
export default function ({ data }) {
  const { useEllipses, maxShowNumber } = data
  let btnStr = ''
  let ellipsesBtnStr = ''
  let iconArr:any = [];
  const getBtn = (item) => {
    if(item.icon !== undefined || ''){
      iconArr.push(item.icon)
    }
    return `<Button 
              ${item.size === undefined ? '' : `size="${item.size}"`}
              ${item.type === undefined ? '' : `type="${item.type}"`}
              ${item.shape === undefined ? '' : `shape="${item.shape}"`}
              >
                <Space 
                  size={${item.iconDistance}}
                >
                  ${item.useIcon && item.iconLocation !== LocationEnum.FRONT ? 
                    item.isCustom ? 
                    `<Image
                      width=${item.contentSize[1]}}
                      height={${item.contentSize[0]}}
                      src="${item.src}"
                      preview={false}
                      >
                    </Image>` : 
                    `<span  
                    style={${JSON.stringify({
                      fontSize: `${item.contentSize[0]}`,
                    })}}>
                    <${item.icon}/></span>` 
                    : ''}
                  ${item.showText? `<span>${item.text}</span>` : ''}
                  ${item.useIcon && item.iconLocation !== LocationEnum.BACK ? 
                    item.isCustom ? 
                    `<Image
                      width="${item.contentSize[1]}"
                      height="${item.contentSize[0]}"
                      src="${item.src}"
                      preview={false}
                      >
                    </Image>` :
                    `<span  
                    style={${JSON.stringify({
                      fontSize: `${item.contentSize[0]}`,
                    })}}>
                    <${item.icon}/></span>` 
                    : ''}
                </Space>
            </Button>`
  }

  if (useEllipses) {

    data.btnList.filter((item, index) => index < maxShowNumber).forEach(item => {
      btnStr += getBtn(item) + '\n'
    })

    data.btnList.filter((item, index) => index >= maxShowNumber).forEach(btn => {
      ellipsesBtnStr += `<Menu.Item key="${btn.key}">${btn.text}</Menu.Item>` + '\n'
    })

    btnStr = btnStr + `
      <Dropdown overlay={<Menu>
        ${ellipsesBtnStr}
        </Menu>}
        placement="bottomRight">
        <EllipsisOutlined />
      </Dropdown>
    `
  } else {
    data.btnList.forEach(item => {
      btnStr += getBtn(item) + '\n'
    })
  }

  btnStr = `<div style={{
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    flexFlow: "row wrap",
    justifyContent: "${data.layout}",
    gap: "${data.spaceSize?.[1]}px ${data.spaceSize?.[0]}px"
  }}>${btnStr}</div>`

  function unique (arr) {
    return Array.from(new Set(arr))
  };
  iconArr = unique(iconArr);
  iconArr = iconArr.filter(Boolean);

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Button', 'Dropdown', 'Menu', 'Space', 'Image']
      },
      {
        from: '@ant-design/icons',
        coms: [ ...iconArr ]
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      }
    ],
  	jsx: btnStr,
    style: '',
    js: ''
  }
}
export default function ({ data }) {
  const { useEllipses, maxShowNumber } = data
  let btnStr = ''
  let ellipsesBtnStr = ''

  const getBtn = (item) => {
    return `<Button size="${item.size ? item.size : ''}" type="${item.type ? item.type : ''}" shape="${item.shape ? item.shape : ''}">${item.text}</Button>`
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



  return {
    imports: [
      {
        form: 'antd',
        coms: ['Button', 'Dropdown', 'Menu']
      },
      {
        form: '@ant-design/icons',
        coms: ['EllipsisOutlined']
      },
      {
        form: 'antd/dist/antd.css',
        coms: []
      }
    ],
  	jsx: btnStr,
    style: '',
    js: ''
  }
}
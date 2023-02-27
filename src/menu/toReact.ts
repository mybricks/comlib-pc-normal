import { MenuItem, MenuTypeEnum } from './constants';
export default function ({ data }) {

  const renderMenuItems = (ds: MenuItem[])=>{
    return (ds|| []).map((item)=>{
      const { key, children, menuType, title } = item || {};
      //分组菜单
      if(menuType === MenuTypeEnum.Group){
        return `
          <div key="${key}">
            <Menu.ItemGroup title="${title}" key="${key}">
              ${renderMenuItems(children).toString().replace(',','')}
            </Menu.ItemGroup>
          </div>
        `.toString().replace(',','')
      }
      //父菜单
      if(menuType === MenuTypeEnum.SubMenu){
        return `
          <Menu.SubMenu title="${title}" key="${key}">
            ${renderMenuItems(children).toString().replace(',','')}
          </Menu.SubMenu>
        `.toString().replace(',','')
      }
      //最后的子菜单
      return `
        <Menu.Item key="${key}">
          ${title}
        </Menu.Item>
      `.toString().replace(',','')
    })
  }

  let menuItemStr = renderMenuItems([...data.dataSource]).toString().replace(',','')

  const renderMenu = (
    data
  ) => {
    return `
    <Menu mode="${data.mode}">
      ${menuItemStr}
    </Menu>`;
  };

  let str = renderMenu(data).toString().replace(',','');

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Menu']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      }
    ],
  	jsx: str,
    style: '',
    js: ''
  }
}
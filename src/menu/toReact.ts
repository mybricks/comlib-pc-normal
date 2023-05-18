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
              ${renderMenuItems(children).toString().replaceAll(',','')}
            </Menu.ItemGroup>
          </div>
        `
      }
      //父菜单
      if(menuType === MenuTypeEnum.SubMenu){
        return `
          <Menu.SubMenu title="${title}" key="${key}">
            ${renderMenuItems(children).toString().replaceAll(',','')}
          </Menu.SubMenu>
        `
      }
      //最后的子菜单
      return `
        <Menu.Item key="${key}">
          ${title}
        </Menu.Item>
      `
    })
  }

  let menuItemStr = renderMenuItems([...data.dataSource]).toString().replaceAll(',','')

  const renderMenu = (
    data
  ) => {
    return `
    <Menu mode="${data.mode}">
      ${menuItemStr}
    </Menu>`;
  };

  let str = renderMenu(data).toString().replaceAll(',','');

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
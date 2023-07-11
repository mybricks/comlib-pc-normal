export enum MenuTypeEnum {
  Menu = 'menu',
  SubMenu = 'subMenu',
  Group = 'group'
}
export enum MenuModeEnum {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Inline = 'inline'
}
export interface MenuItem {
  _key: string;
  key: string;
  title: string;
  value?: any;
  menuType?: MenuTypeEnum;
  children: MenuItem[];
  defaultActive?: boolean;
  [key: string]: any;
  useIcon?: boolean;
  icon?: string;
}
/**
 * 数据源
 */
export interface Data {
  dataSource: MenuItem[];
  mode: MenuModeEnum;
}

export const OutputIds = {
  ClickMenu: 'click',
  GetActiveItem: 'getActiveItem'
};

export const InputIds = {
  SetMenuData: 'setMenuData',
  SetActiveItem: 'setActiveItem',
  GetActiveItem: 'getActiveItem'
};

export const uuid = (pre = 'u_', len = 6) => {
  const seed = 'abcdefhijkmnprstwxyz0123456789',
    maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
};

export const findMenuItem = (
  ds: MenuItem[],
  key?: string,
  oriItem?: boolean
) => {
  let menuItem;
  for (let item of ds) {
    if (item.key === key || item.title === key) {
      menuItem = item;
      break;
    }
    if (Array.isArray(item.children)) {
      const temp = findMenuItem(item.children, key, oriItem);
      if (temp) {
        menuItem = temp;
        break;
      }
    }
  }
  if (oriItem) {
    return menuItem;
  }
  if (menuItem) {
    const { _id, defaultActive, ...res } = menuItem;
    return res;
  }
  return undefined;
};

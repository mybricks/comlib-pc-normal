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

export const descriptionUpList = [
  {
    type: 'input',
    id: 'setMenuData',
    schema: {
      "title": "菜单数据",
      "type": "object",
      "properties": {
        "dataSource": {
          "title": "菜单数据",
          "type": "array",
          "description": "导航菜单数据",
          "items": {
            "type": "object",
            "properties": {
              "title": {
                "title": "标题",
                "description": "菜单项标题",
                "type": "string"
              },
              "key": {
                "title": "唯一标识",
                "description": "菜单项标识",
                "type": "string"
              },
              "menuType": {
                "title": "类型",
                "type": "string",
                "description": "菜单项类型，可以为普通菜单项menu、子菜单subMenu, 分组菜单group"
              },
              "children": {
                "title": "子菜单数据",
                "description": "自菜单的数据，数组结构，内容和菜单项一致",
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {}
                }
              },
              "value": {
                "title": "其他数据",
                "type": "string"
              }
            }
          }
        },
        "defaultActive": {
          "title": "默认选中项",
          "description": "默认选中的菜单，这里传菜单的key",
          "type": "string"
        }
      }
    }
  },
  {
    type: 'output',
    id: 'click',
    schema: {
      "type": "object",
      "properties": {
        "title": {
          "title": "标题",
          "description": "点击的菜单项标题",
          "type": "string"
        },
        "key": {
          "title": "唯一标识",
          "description": "点击的菜单项标识key",
          "type": "string"
        },
        "menuType": {
          "title": "类型",
          "type": "string",
          "description": "点击的菜单项类型"
        },
        "value": {
          "title": "其他数据",
          "description": "点击的菜单项的其他数据",
          "type": "any"
        }
      }
    }
  },
  {
    type: 'output',
    id: 'setMenuDataDone',
    schema: {
      "title": "菜单数据",
      "type": "object",
      "properties": {
        "dataSource": {
          "title": "菜单数据",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": {
                "title": "标题",
                "description": "菜单项标题",
                "type": "string"
              },
              "key": {
                "title": "唯一标识",
                "description": "菜单项标标识",
                "type": "string"
              },
              "menuType": {
                "title": "类型",
                "type": "string",
                "description": "菜单项类型"
              },
              "value": {
                "title": "其他数据",
                "description": "菜单项的其他数据",
                "type": "any"
              }
            }
          }
        },
        "defaultActive": {
          "title": "默认选中项",
          "type": "string"
        }
      }
    }
  }
]
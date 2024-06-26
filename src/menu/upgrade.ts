import { Data, MenuItem } from './constants';
import { descriptionUp } from '../form-coms/utils/descriptionUp';
import { descriptionUpList } from './constants';

export default function ({ 
  data, 
  input, 
  output, 
  getDeclaredStyle, 
  removeDeclaredStyle,
  setDeclaredStyle
}: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.5->1.0.6 改变设置数据的schema
  */

  const setMenuData = input.get('setMenuData');
  const dataSchema = {
    title: "菜单数据",
    type: "object",
    properties: {
      dataSource: {
        title: "菜单数据",
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              title: "标题",
              type: "string"
            },
            key: {
              title: "唯一标识",
              type: "string"
            },
            menuType: {
              title: "类型",
              type: "string"
            },
            children: {
              title: "子菜单数据",
              type: "array",
              items: {
                type: "object",
                properties: {}
              }
            },
            value: {
              title: "其他数据",
              type: "string"
            }
          }
        }
      },
      defaultActive: {
        title: "默认选中项",
        type: "string"
      }
    }
  };
  setMenuData.setSchema(dataSchema);

  /**
   * @description v1.0.7 为每一项增加_key属性，作为点击输出的key; 输出项不存在时，增加输出项
   */
  const addKey = (ds: MenuItem[]) => {
    ds.forEach(item => {
      if (item.key && !item._key) {
        item._key = item.key;
      }
      if (!output.get(item.key)) {
        output.add(item.key, `点击${item.title}`, { type: 'any' });
      }
      if (Array.isArray(item.children)) {
        addKey(item.children);
      }
    })
  }
  addKey(data.dataSource);


  /**
   * @description v1.0.11 新增设置数据、选中项完成
  */
  if (!output.get("setMenuDataDone")) {
    output.add("setMenuDataDone", '设置数据完成', dataSchema);
  }
  if (output.get("setMenuDataDone") &&
    input.get("setMenuData") &&
    !input.get("setMenuData")?.rels?.includes("setMenuDataDone")) {
    input.get("setMenuData").setRels(["setMenuDataDone"]);
  }

  if (!output.get("setActiveItemDone")) {
    output.add("setActiveItemDone", '设置选中项完成', {
      title: "菜单名称/唯一标识",
      type: "string"
    });
  }
  if (output.get("setActiveItemDone") &&
    input.get("setActiveItem") &&
    !input.get("setActiveItem")?.rels?.includes("setActiveItemDone")) {
    input.get("setActiveItem").setRels(["setActiveItemDone"]);
  }

  /**
   * @description v1.0.20 新增description
  */
  descriptionUp(descriptionUpList, input, output);
  //=========== 1.0.20 end ===============

  /**
   * @description v1.0.22 改变target
  */
  const preItemStyle = getDeclaredStyle('ul li:hover');

  if ( preItemStyle) {
    let contentCss = { ...preItemStyle.css };
    removeDeclaredStyle('ul li:hover');
    setDeclaredStyle([
      'ul li:hover','.ant-menu-light .ant-menu-submenu-title:hover',
      '.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-open',
      '.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover',  
      '.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-open',
      '.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover'

    ], contentCss, true);
  }

  const preTargetStyle = getDeclaredStyle('.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover::after');
  if(preTargetStyle){
    let contentCss = { ...preTargetStyle.css };
    removeDeclaredStyle('.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover::after');
    setDeclaredStyle([
      '.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover::after',
      '.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover::after',
      '.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-open::after',
      '.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-open::after', 
      '.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover::after',
    ], contentCss, true);
  }

  //=========== 1.0.22 end ===============
  return true;
}
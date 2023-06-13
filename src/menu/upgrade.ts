import { Data, MenuItem } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
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
   * @description v1.0.8->v1.0.9 为每一项增加showIcon（是否显示图标）和icon（图标）
   */
  data.dataSource.forEach(item => {
    if(!item.showIcon){
      item.showIcon = false;
    }
    if(!item.icon){
      item.icon = 'AppstoreOutlined';
    }
  })

  return true;
}
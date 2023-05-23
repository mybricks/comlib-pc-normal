import { Data } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.5->1.0.6 改变设置数据的schema
  */

  const setMenuData = input.get('setMenuData');
  const dataSchema = {
    id: "setMenuData",
    title: "设置数据",
    desc: "设置初始数据和选中项",
    schema: {
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
    }
  };
  setMenuData.setSchema(dataSchema);

  return true;
}
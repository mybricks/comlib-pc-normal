import { Data } from "./constants";

export default function ({
  data,
  output,
  setDeclaredStyle,
  registerPermission
}: UpgradeParams<Data>): boolean {

  data.tabList.forEach(tab=>{
    /**
     * @description v1.0.7 -> v1.0.8 权限能力改版
     * 把 permissionKey 转化成新版 permission 数据
     */
    // @ts-expect-error permissionKey 已废弃，type 中不存在此字段
    if(tab.permissionKey) {
      const { id } = registerPermission({
        // @ts-expect-error permissionKey 已废弃，type 中不存在此字段
        code: tab.permissionKey,
        title: '权限名称'
      })
      tab.permission = { id };
    }
  })

  return true;
}
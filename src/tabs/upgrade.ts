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

  /**
    * @description v1.0.8 -> v1.0.9 增加通知类型、尺寸、位置偏移、状态
  */
 data.tabList.forEach(item => {
  if(typeof item.infoType === 'undefined'){
    item.infoType = 'text'
  }
  if(typeof item.size === 'undefined'){
    item.size = 'default'
  }
  if(typeof item.offset === 'undefined'){
    item.offset = [0, 0]
  }
  if(typeof item.status === 'undefined'){
    item.status = 'error'
  }
  if(typeof item.showZero === 'undefined'){
    item.showZero = false
  }
 })

  return true;
}
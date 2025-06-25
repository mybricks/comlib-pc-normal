
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '锚点容器',
    usage: `data声明
useLoading?: boolean = false
loadingTip?: string = "Loading..."
enableFix: boolean = true
useDynamicData: boolean = false
staticData: any[] = [{ "id": "XsbYMT", "_id": "XsbYMT", "title": "锚点1" }]
anchorPosition: 'left' | 'right' = "left"

slots插槽
item: 开启动态设置数据源后的锚点目标内容
slotId1: 锚点1目标内容
slotId2: 锚点2目标内容

styleAry声明
无`
  }
};

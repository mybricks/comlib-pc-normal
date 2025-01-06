import { comsArrFun, uuid, basicComPropsTrans } from './basicUtils'

const typeMap = {
  "line": "line",
  "editable-card'": "card",
}
const sizeMap = {
  "small": "small",
  "middle": "default",
  "large": "large"
}

export const tabPropsTrans = (item)=>{
  console.log('tab的item', item);
  let tabProps = {
    ...basicComPropsTrans(item),
    type: typeMap[item.props.type] || 'line',
    size: sizeMap[item.props.size] || "default",
    tabPane: {
      type: "array",
      value: tabPanel(item)
    }
  }
  return tabProps
}

const tabPanel = (item)=>{
  let valueArr:any = [];
  item.props.tabList.forEach(tab=>{
    valueArr.push(
      {
        "type": "component",
        "value": {
          "id": "comp_" + tab.id + uuid(),
          "type": "@es/tianhe-basic-materials::TabPane",
          "name": "标签面板",
          "props": {
            "tabKey": tab.key,
            "tab": tab.name
          },
          "children": comsArrFun(tab.slots)
        }
      },
    )
  })
  return valueArr;

}
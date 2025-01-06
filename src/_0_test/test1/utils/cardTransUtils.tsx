import { transMap } from '../comTrans'
import { comsArrFun } from './basicUtils'
export const cardTitleTrans = (item)=>{
  let titleProps = {
    type: 'array',
    value: [
      {
        "type": "component",
        "value": {
          "id": "comp_" + item.id + "card_title",
          "type": "@es/tianhe-basic-materials::CardTitle",
          "name": "卡片标题",
          "children": [
            {
              "id": "comp_" + item.id + "card_title_text",
              "type": "@es/tianhe-basic-materials::Text",
              "name": "文本",
              "children": [],
              "props": {
                "label": item.props.title,
                "contentType": "text"
              }
            }
          ]
        }
      }
    ]
  }
  return titleProps;
}

export const cardBodyTrans = (item)=>{

  // let childList:any = [];
  // item.slots.forEach(slot => {
  //   if(Array.isArray(transMap[slot.type](slot))){
  //     childList = childList.concat(transMap[slot.type](slot))
  //     return
  //   }
  //   childList.push(transMap[slot.type](slot))
  // })

  let bodyProps = {
    type: 'array',
    value: [
      {
        "type": "component",
        "value": {
          "id": "comp_a7qjG_6w-4Blhj6HwgO_W",
          "type": "@es/tianhe-basic-materials::CardBody",
          "name": "卡片内容",
          "props": {
            "content": "卡片内容"
          },
          //"children": childList
          "children": comsArrFun(item.slots)
        }
      }
    ]
  }

  return bodyProps;
}
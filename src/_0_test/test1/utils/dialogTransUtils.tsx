import { comsArrFun, basicComPropsTrans, uuid } from './basicUtils'; 

export const modelPropsTrans = (item) => {
  return {
    ...basicComPropsTrans(item),
      title: !item.props.hideTitle ? item.props.title : '',
      ...footerBtnPropsTrans(item.props),
      modalContent: {
        type: "array",
        "value": modalTrans(item.props, item.slots)
      }
  }
}

// 方舟弹窗内容 -> 天河弹窗内容
const modalTrans = (props, slots) => {
  let valueArr;
  valueArr = [{
    "type": "component",
    "value": {
      "id": props.id,
      "type": "@es/tianhe-basic-materials::ModalContent",
      "name": "弹窗内容",
      "children": comsArrFun(slots)
    }
  }]
  return valueArr
}

const footerBtnPropsTrans = (props) =>{
  let footerProps:any = {};
  let footerBtnsId = props.footerBtns.map((item) => item.id)
  if(props.useFooter && Array.isArray(props.footerBtns)){
    if(JSON.stringify(footerBtnsId) === JSON.stringify(["cancel","ok"])){
      props.footerBtns.forEach((btn)=>{
        if(btn.id === "cancel" && btn.showText){
          footerProps.cancelText = btn.title;
          footerProps.cancelHidden = true
        }
        if(btn.id === "ok" && btn.showText){
          footerProps.okText = btn.title;
          footerProps.okHidden = true;
          footerProps.okType = btn.type;
        }
      })
    }else{
      footerProps.custom = true;
      footerProps.footerContent = footerContent(props);
    }
  }
  return footerProps;
}

const footerContent = (props)=>{
  let childrenArr:any = [];
  props.footerBtns.forEach((btn)=>{
    childrenArr.push({
      "id": "comp_" + btn.id + uuid(),
      "type": "@es/tianhe-basic-materials::Button",
      "name": "按钮",
      "children": [],
      "props": {
        "label": btn.showText ? btn.title : '',
        "type": btn.type,
        "size": btn.size,
      }
    })
  })

  return {
    "type": "array",
    "value": [
      {
        "type": "component",
        "value": {
          "id": "comp_" + props.id + "ModalFooterContent",
          "type": "@es/tianhe-basic-materials::ModalFooterContent",
          "name": "底部内容",
          "props": {
            "content": "底部内容",
            "footerContent": {
              "type": "array",
              "value": []
            }
          },
          "children": childrenArr
        }
      }
    ]
  }
}
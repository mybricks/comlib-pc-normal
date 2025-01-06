import { comsArrFun, basicComPropsTrans, uuid } from './basicUtils';
  //抽屉
  export const drawerPropsTrans = (item) => {
    return {
      ...basicComPropsTrans(item),
        title: !item.props.hideTitle ? item.props.title : '',
        ...footerBtnPropsTrans(item.props),
        drawerContent: {
          type: "array",
          "value": drawerContentTrans(item.props, item.slots)
        }
    }
  }

  export const drawerContentTrans = (props, slots) => {
    let valueArr;
    valueArr = [{
      "type": "component",
      "value": {
        "id": props.id,
        "type": "@es/tianhe-basic-materials::DrawerContent",
        "name": "抽屉内容",
        "children": comsArrFun(slots)
      }
    }]
    return valueArr
  }
  
  const footerBtnPropsTrans = (props) =>{
    let footerProps:any = {};
    let footerBtnsId = props.footerBtns && props.footerBtns.map((item) => item.id)
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
            "type": "@es/tianhe-basic-materials::DrawerFooterContent",
            "name": "抽屉底部内容",
            "children": childrenArr
          }
        }
      ]
    }
  }
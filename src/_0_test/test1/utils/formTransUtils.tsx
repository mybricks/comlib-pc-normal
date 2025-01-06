import { uuid } from "./basicUtils";
import { comsArrFun } from './basicUtils';

// 方舟表单 -> 天河表单项
export const formItemTrans = (props, slots) => {
  let valueArr:any = [];
  valueArr = slots.map((item)=>{
    return {
      "type": "component",
      "value": {
        "id": item.id,
        "type": "@es/tianhe-basic-materials::FormItem",
        "name": "表单项",
        "children": slotsTrans(item),
        "props": {
          //自定义内容项，没有对应的label和name
          ...((item.type !== 'mybricks.normal-pc.form-addition-container') ?
          {
            label: labelMatch(item, props),
            name: nameMatch(item, props),
            extra: extraMatch(item, props),
            ...widthMatch(item, props),
            ...(item.type === "mybricks.normal-pc.form-list" && {
              items: formListItemTrans(props, item),
              "formListEnabled": true
            })
          } :
          {
            name: item.id
          })
        }
      }
    }
  })

  if(props.actions.items && props.actions.visible){
    valueArr.push({
      "type": "component",
      "value": {
        "id": "com_" + uuid(),
        "type": "@es/tianhe-basic-materials::FormItem",
        "name": "表单项",
        "children": actionsTrans(props.actions.items),
      }
    })
  }

  return valueArr
}

//动态表单项的children
export const formListItemTrans = (props, item) => {
  let valArr = item.slots.map((slot)=>{
    return {
      "type": "component",
      "value": {
        "id": "comp_2n1vPDs_1vEAmgOuHAIAA",
        "type": "@es/tianhe-basic-materials::FormListItem",
        "name": "表单组子项",
        "props": {
          "render": {
            "type": "array",
            "value": [
              {
                "type": "render-fn",
                "value": formItemTrans(item.props, [slot])[0].value
              }
            ]
          }
        }
      }
    }
  })

  return {
    "type": "array",
    "value": valArr
  }
}



//方舟自定义内容项 -> 天河表单项children
const slotsTrans = (item)=>{
  let childrenArr;
  //普通表单项时
  if(item.type !== 'mybricks.normal-pc.form-addition-container'){
    childrenArr =  comsArrFun([item])
  }else{
    childrenArr = comsArrFun(item.slots)
  }
  return childrenArr;
}

//label匹配，通过id从表单项找到（之后得扩展到别的表单项属性）
const labelMatch = (item, props) =>{
  const itemProps = props.items.find((val)=>{
    return val.id === item.id
  })
  return itemProps?.label || '标题未知'
}

//name匹配，通过id从表单项找到（之后得扩展到别的表单项属性）
const nameMatch = (item, props) =>{
  const itemProps = props.items.find((val)=>{
    return val.id === item.id
  })
  return itemProps?.name || uuid()
}

//提示信息
const extraMatch = (item, props) =>{
  const itemProps = props.items.find((val)=>{
    return val.id === item.id
  })
  return itemProps?.description || ''
}

//表单项宽度
const widthMatch = (item, props) =>{
  const itemProps = props.items.find((val)=>{
    return val.id === item.id
  })
  //console.log('props123', props);
  
  if(props.formItemColumn === 1 && (itemProps  && itemProps?.widthOption === 'px' || (itemProps?.widthOption === 'span' && item?.span !== 24))){
    let width = itemProps.widthOption === 'px' ? itemProps.width + 'px' :  (itemProps.span*100/24) + '%'
    let styleOpt = {
      "style": {
        "type": "static",
        "value": {
          "width": width
        }
      }
    }
    return styleOpt
  }else{
    return {}
  }
}
const actionsTrans = (actions) => {
  let actionArr:any = [];
  actions.forEach(item => {
    if(item.visible){
      actionArr.push({
        "id": "comp_" + item.key,
        "type": "@es/tianhe-basic-materials::Button",
        "name": "按钮",
        "props": {
          "label": item.title,
          "type": item.type,
          "style": {
            "type": "static",
            "value": {
              "margin": "0px 8px 0px 0px"
            }
          }
        }
      })
    }
  });
  return actionArr;
}
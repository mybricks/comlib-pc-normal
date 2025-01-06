import { basicComPropsTrans } from "./basicUtils";

export const stepsPropsTrans = (item)=>{
  let stepProps = {
    ...basicComPropsTrans(item),
    direction: item.props.steps.direction,
    size: item.props.steps.size,
    stepData: item.props.stepAry.map((item)=>{
      return stepItemPropsTrans(item)
    })
  }
  return stepProps
}

export const stepDataMap = {
  "title": "title",
  "subTitle": "subTitle",
  "type": "type"
}

const stepItemPropsTrans = (com) => {
  let newProps = {};
  
  Object.keys(com).forEach(key => {
    if(stepDataMap[key]){
      newProps[stepDataMap[key]] = com[key]
    }
  });
  return newProps;
}
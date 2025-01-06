import { comsMap } from '../const';
import { transMap } from '../comTrans'

export function uuid(pre = 'u_', len = 6) {
  const seed = 'abcdefhijkmnprstwxyz0123456789', maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}

//组件特殊处理，比如工具条、文本排版、标签列表
export const comsArrFun = (json)=>{
  let newComsArr:any = [];
  
  json.forEach(item => {
    if(transMap[item.type]){
      if(Array.isArray(transMap[item.type](item))){
        newComsArr = newComsArr.concat(transMap[item.type](item))
        return
      }
      newComsArr.push(transMap[item.type](item))
    }
  })
  return newComsArr
}

//props转换, 文本、按钮
export const basicComPropsTrans = (com) => {
  let props = com.props;
  let propsMap = comsMap[com.type]?.props;
  let newProps = {};
  
  Object.keys(props).forEach(key => {
    if(propsMap[key]){
      newProps[propsMap[key]] = props[key]
    }
  });
  
  return newProps;
}

//props转换, 工具条
export const btnComPropsTrans = (btn) => {
  let props = btn;
  let propsMap = comsMap["mybricks.normal-pc.toolbar"]?.props;
  let newProps = {};
  
  Object.keys(props).forEach(key => {
    newProps[propsMap[key]] = props[key]
  });
  
  return newProps;
}

//表单项转换, 下拉框
export const formItemPropsTrans = (com) => {
  let {config, ...props} = com.props;
  props = {
    ...props,
    ...config
  }
  let propsMap = comsMap[com.type]?.props;
  let newProps = {};
  Object.keys(props).forEach(key => {
    if(propsMap[key] && props[key]){
      newProps[propsMap[key]] = props[key]
    }
  });
  return newProps;
}

//props转换, 文本排版
export const textComPropsTrans = (text) => {
  let props = text;
  let propsMap = comsMap["mybricks.normal-pc.typography"]?.props;
  let newProps = {};
  
  Object.keys(props).forEach(key => {
    newProps[propsMap[key]] = props[key]
  });
  
  return newProps;
}

//props转换, 标签列表
export const tagComPropsTrans = (tag) => {
  let props = tag;
  let propsMap = comsMap["mybricks.normal-pc.tagList"]?.props;
  let newProps = {};
  
  Object.keys(props).forEach(key => {
    newProps[propsMap[key]] = props[key]
  });
  
  return newProps;
}

//折叠面板props转换
export const collapsePropsTrans = (props) => {
  let newProps = {
  "panel": {
      "type": "array",
      "value": [
        {
          "type": "component",
          "value": {
            "id": props.id + uuid(),
            "type": "@es/tianhe-basic-materials::CollapsePanel",
            "name": "折叠面板项",
            "props": {
              header: props.props.title
            },
            "children": props.slots && comsArrFun(props.slots)
            // "children": props.slots.map((item)=>{
            //   //子项的整体处理
            //   if(transMap[item.type]){
            //     return transMap[item.type](item)
            //   }else{
            //     return {}
            //   }
            // }).filter(element =>  element.type !== undefined)
          }
        }
      ]
    }
  }
  return newProps
}
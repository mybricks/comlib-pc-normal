import { comsMap } from './const';
import { comsArrFun } from './utils/basicUtils';
import { containerSlotsTrans } from './utils/gridTransUtils';

export const getTianheJSON = (json)=>{
  let transJSONArr = fzJsonTrans(json).flat();
  console.log('transJSONArr', transJSONArr)
  return comsArrFun(transJSONArr)
}

const fzJsonTrans = (json) => {
  //页面场景
  const scenesArr = json.scenes;
  
  let newScenes = [];
  const sceneTrans = (scene) => {
    //场景组件
    const comsObj = scene.coms;
    let comsArr = scene.slot.comAry;
    
    const comsTrans = (com) => {
      let childItem:any = [];
      
      com.forEach(item => {
          const slotComsAry = 
          //动态表单项(from-list)
          item.slots?.formItems?.comAry
          ||item.slots?.container?.comAry 
          || item.slots?.content?.comAry 
          //自定义内容项
          || item.slots?.["form-addition-container"]?.comAry 
          //自定义表单项
          || item.slots?.["formItem"]?.comAry
          //列表容器
          || item.slots?.item?.comAry
          //对话框（popup）
          || item.slots?.body?.comAry;
        
        const isSlot = item.slots && slotComsAry
        const containerList = ["mybricks.normal-pc.grid", "mybricks.basic-comlib.dragable-layout", "mybricks.normal-pc.tabs", "mybricks.basic-comlib.grid", "mybricks.normal-pc.table"];
        
        //这里的slot字段往哪里插入，取决于组件类型
        childItem.push({
          id: item.id,
          type: item.def.namespace,
          // props: item.def.namespace !== "mybricks.normal-pc.grid" ? 
          //   comsObj[item.id].model.data :
          //   gridSlotsTrans(item, comsObj, comsTrans),
          props: !containerList.includes(item.def.namespace) ? 
            comsObj[item.id].model.data :
            containerSlotsTrans(item, comsObj, comsTrans, item.def.namespace),
          ...isSlot && {slots: comsTrans(slotComsAry)}
        })

        //步骤条组件特殊处理, slots内容全部展开, 嵌套一个自定义容器
        if(item.def.namespace === "mybricks.normal-pc.steps" && !comsObj[item.id].model.data.hideSlots){
          Object.values(item.slots).forEach((item:any)=>{
            item.comAry && item.comAry.length > 0 && childItem.push({
              id: item.id,
              type: "mybricks.normal-pc.custom-container",
              props: {},
              slots: comsTrans(item.comAry)
            })
          })
        }

      });
      return childItem;
    }
    return comsTrans(comsArr)
  }
  
  newScenes = scenesArr.map((scene)=>{
    return sceneTrans(scene)
  })
  
  return newScenes
}
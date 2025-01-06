//import { toJSON } from './json';
//import { toJSON } from './json2';
//import { toJSON } from './json3';
//import { toJSON } from './json4';
import { toJSON } from './json';
import { comsMap } from './const';
import { comsArrFun } from './utils/basicUtils';
import { containerSlotsTrans } from './utils/gridTransUtils';
import { useEffect } from 'react';
import { getFileContent, getFilePubInfoByFileId } from './utils/getFileContent'

import dumpJSON from './dump.json'
//import dumpJSON from './dump2.json';

import { getServiceList } from './serviceTrans';
import { getTianheJSON } from './jsonTrans';

export default (props) => {
  const { env, data, slots, inputs } = props;

  const transFun = (id)=>{
    let goalObj = {};
    getFilePubInfoByFileId(id).then(val=>{
      let fileContentId;
      if(val.data && Array.isArray(val.data)){
        fileContentId = val.data[0].fileContentId;
        //let runtimeJson = JSON.parse(val.data[0].runtimeJson);
        let runtimeJson = toJSON;
        console.log("runtimeJson123", runtimeJson);

        goalObj['tianheViewSchema'] = {
          type: "@es/tianhe-basic-materials::Root",
          id: "root",
          name: "页面",
          children: getTianheJSON(runtimeJson)
        }

        if(fileContentId){
          getFileContent(fileContentId).then(val=>{
            if(val.code !== -1 && val.data){
              let data = JSON.parse(val.data[0].content);
              goalObj['debugDomain'] = data.debugDomain
              goalObj['serviceList'] = getServiceList({
                content: data.content
              })
            }
          })
        }
      }
    }).catch( error =>{
      console.log('error', error)
    })
    return goalObj;
  }

  //console.log('transFun(57252)', transFun(57252));
  console.log('transFun(12081)', transFun(12081));
  // const jsonTrans1 = (json) => {
  //   //页面场景
  //   const scenesArr = json.scenes;
    
  //   let newScenes = [];
  //   const sceneTrans = (scene) => {
  //     //场景组件
  //     const comsObj = scene.coms;
  //     let comsArr = scene.slot.comAry;
      
      
  //     const comsTrans = (com) => {
  //       let childItem:any = [];
        
  //       com.forEach(item => {
  //           const slotComsAry = 
  //           //动态表单项(from-list)
  //           item.slots?.formItems?.comAry
  //           ||item.slots?.container?.comAry 
  //           || item.slots?.content?.comAry 
  //           //自定义内容项
  //           || item.slots?.["form-addition-container"]?.comAry 
  //           //自定义表单项
  //           || item.slots?.["formItem"]?.comAry
  //           //列表容器
  //           || item.slots?.item?.comAry
  //           //对话框（popup）
  //           || item.slots?.body?.comAry;
          
  //         const isSlot = item.slots && slotComsAry
  //         const containerList = ["mybricks.normal-pc.grid", "mybricks.basic-comlib.dragable-layout", "mybricks.normal-pc.tabs", "mybricks.basic-comlib.grid"];
          
  //         //这里的slot字段往哪里插入，取决于组件类型
  //         childItem.push({
  //           id: item.id,
  //           type: item.def.namespace,
  //           // props: item.def.namespace !== "mybricks.normal-pc.grid" ? 
  //           //   comsObj[item.id].model.data :
  //           //   gridSlotsTrans(item, comsObj, comsTrans),
  //           props: !containerList.includes(item.def.namespace) ? 
  //             comsObj[item.id].model.data :
  //             containerSlotsTrans(item, comsObj, comsTrans, item.def.namespace),
  //           ...isSlot && {slots: comsTrans(slotComsAry)}
  //         })

  //         //步骤条组件特殊处理, slots内容全部展开, 嵌套一个自定义容器
  //         if(item.def.namespace === "mybricks.normal-pc.steps" && !comsObj[item.id].model.data.hideSlots){
  //           Object.values(item.slots).forEach((item:any)=>{
  //             item.comAry && item.comAry.length > 0 && childItem.push({
  //               id: item.id,
  //               type: "mybricks.normal-pc.custom-container",
  //               props: {},
  //               slots: comsTrans(item.comAry)
  //             })
  //           })
  //         }

  //       });
  //       return childItem;
  //     }
  
  //     console.log('comsArr123', comsArr)
  //     return comsTrans(comsArr)
  //   }
    
  //   newScenes = scenesArr.map((scene)=>{
  //     return sceneTrans(scene)
  //   })
    
  //   return newScenes
  // }
  
  // console.log('jsonTrans()', jsonTrans1(toJSON))
  
  // let transJSONArr = jsonTrans1(toJSON).flat();
  // console.log('transJSONArr1', transJSONArr)
  
  // //不加props的转换函数
  // const jsonTrans2 = (json) => {
  //   let newComsArr = [];
  //   newComsArr = json.map((item)=>{
  //     return {
  //       id: item.id,
  //       type: comsMap[item?.type]?.type,
  //       name: comsMap[item?.type]?.name
  //     }
  //   })
  
  //   return newComsArr
  // }
  
  // console.log('jsonTrans2', jsonTrans2(transJSONArr))
  
  // //天河schema
  // const tianheJSON = comsArrFun(transJSONArr);
  // console.log('tianheJSON', tianheJSON)

  // //serviceList
  // const serviceList = getServiceList(dumpJSON);
  // console.log('serviceList', serviceList);

  return (
    // <div className={css.rainbow}>彩虹动效</div>
    <div>测试测试测试1234</div>
  );
}

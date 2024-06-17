import { merge } from "lodash";
import { uuid } from "../utils"
export default ({ env, data, inputs, outputs, onError }) => {
  const next = !env.runtime.debug;
  //const next = true;
  // 设置描述列表列表项
  inputs["setFormDetail"]((ds) => {
    if (next && ds) {
      const formDetail = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id })
      let {itemData, title, showTitle} = ds;
      let items = (itemData || []).map((item) => {
        if (!item.key) {
          item.key = uuid();
        } 

        if(item.showLabel && typeof item.showLabel !== "boolean"){
          item.showLabel = true;
        }

        if(item.visible && typeof item.visible !== "boolean"){
          item.visible = true;
        }
        
        return item;
      });

      
      formDetail.data = merge(formDetail.data, { 
        items: items, 
        title: title ? title : data.title, 
        showTitle: showTitle ? showTitle: data.showTitle
      });
      
      outputs["onComplete"]();
      
    }
  })
};
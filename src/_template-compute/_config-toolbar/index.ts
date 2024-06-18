import { merge } from "lodash";
export default ({ env, data, inputs, outputs, onError }) => {
  //const next = !env.runtime.debug;
  //const next = true;
  inputs.creator((value) => {
    const { toolbarData } = value;
    if (toolbarData) {
      const toolbar = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id })
      let { btnList } = toolbarData;
      btnList = (btnList || []).map((btn) => {
        if(!btn.contentSize){
          btn.contentSize = [14, 14]
        }
        return btn;
      });

      if (data.operationType === "setData") {
        toolbar.data = merge(toolbar.data, { ...toolbarData, btnList });
        outputs.onComplete();
      } else if (data.operationType === "addBefore") {
        let newBtnLists = [...btnList, ...toolbar.data.btnList];
        toolbar.data.btnList = newBtnLists;
        toolbar.data = merge(toolbar.data, { ...toolbarData, btnList });
        outputs.onComplete();
      } else if (data.operationType === "addAfter") {
        toolbar.data = merge(toolbar.data, { ...toolbarData, btnList: [...toolbar.data.btnList, ...btnList] });
        outputs.onComplete();
      }
    }
  });
};

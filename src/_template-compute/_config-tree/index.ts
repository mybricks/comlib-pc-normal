import { merge } from "lodash";
export default ({ env, data, inputs, outputs, onError }) => {
  const next = env.runtime;
  // 设置数据源
  inputs["setFieldName"]((ds) => {
    if (next && ds) {
      if (ds) {
        const tree = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id })
        let {titleFieldName, keyFieldName, childrenFieldName} = ds;
        
        tree.data = merge(tree.data, {
          titleFieldName: titleFieldName ? titleFieldName : data.titleFieldName, 
          keyFieldName: keyFieldName ? keyFieldName: data.keyFieldName,
          childrenFieldName: childrenFieldName ? childrenFieldName: data.childrenFieldName
        });
        
        outputs["onComplete"]();
        
      }
    }
  })
};

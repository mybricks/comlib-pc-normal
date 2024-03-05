import { typeCheck } from '../utils';
import { jsonToSchema } from '../_code-segment/util';
import { Data, dataSourceTypeMap, InputIds, OutputIds, Schemas, TypeEnum } from './constant';

export default function ({
  data,
  input,
  output,
}: UpgradeParams<Data>): boolean {
  //1.0.0 -> 1.0.1
  if (data.json === '[]') {
    data.json = JSON.stringify(dataSourceTypeMap[data.dataSourceType]);
  }
  if (!data.jsonObj) {
    try {
      if (typeCheck(data.json, ['Array', 'Object'])) {
        data.jsonObj = data.json;
      } else if (typeof data.json === 'string') {
        data.jsonObj = JSON.parse(decodeURIComponent(data.json));
      } else {
        data.jsonObj = dataSourceTypeMap[data.dataSourceType];
      }
    } catch (e) {
      data.jsonObj = {};
    }
  }
  const getJsonDataInput = input.get(InputIds.GetJsonData);
  const jsonDataOutput = output.get(OutputIds.JsonData);
  if (!getJsonDataInput) {
    input.add(InputIds.GetJsonData, '输出数据', Schemas.Any);
  }
  if (!jsonDataOutput) {
    const dsSchema = data.dataSourceType === 'default'
      ? jsonToSchema(data.jsonObj)
      : {
        type: data.dataSourceType
      }
    output.add(OutputIds.JsonData, '数据输出', dsSchema);
    input.get(InputIds.GetJsonData).setRels([OutputIds.JsonData])
  }

  /**
  * @description v1.0.5 , 增加背景色、节点悬浮背景色配置项
  */
  if (!data.colors[TypeEnum.BackgroundColor]) {
    data.colors[TypeEnum.BackgroundColor] = 'rgba(255,255,255,1)';
  }
  if (!data.colors[TypeEnum.NodeHoverBackgroundColor]) {
    data.colors[TypeEnum.NodeHoverBackgroundColor] = 'rgba(245,245,245,1)';
  }

  /**
  * @description v1.0.10 , 增加 设置展开深度 输入项
  */
  if (!input.get(InputIds.SetExpandDepth)) {
    input.add(InputIds.SetExpandDepth, '设置展开深度', {
      type: 'number'
    });
  }

  /**
  * @description v1.0.11->v1.0.12 , 增加 设置数据源、展开深度 完成
  */
  if (!output.get("setJsonDataDone")) {
    output.add("setJsonDataDone", "设置数据源完成", { type: "Object" });
  }
  if (output.get("setJsonDataDone") &&
    input.get("jsonData") &&
    !input.get("jsonData")?.rels?.includes("setJsonDataDone")) {
    input.get("jsonData").setRels(["setJsonDataDone"]);
  }

  if (!output.get("setExpandDepthDone")) {
    output.add("setExpandDepthDone", "设置展开深度完成", { type: "number" });
  }
  if (output.get("setExpandDepthDone") &&
    input.get("setExpandDepth") &&
    !input.get("setExpandDepth")?.rels?.includes("setExpandDepthDone")) {
    input.get("setExpandDepth").setRels(["setExpandDepthDone"]);
  }

  if (data.copyStringWithQuotation === undefined) {
    data.copyStringWithQuotation = true;
  }

  return true;
}
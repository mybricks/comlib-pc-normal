import { typeCheck } from '../utils';
import { jsonToSchema } from '../_code-segment/util';
import { Data, dataSourceTypeMap, InputIds, OutputIds, Schemas } from './constant';

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
  return true;
}
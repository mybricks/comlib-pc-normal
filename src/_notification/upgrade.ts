import { Data, OutputIds, InputIds } from './constants';

export default function ({
  data,
  output,
  input
}: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.1 -> v1.0.2 增加input-open的提示信息
   * 
  */
  const openSchema = {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "通知提醒标题"
      },
      "content": {
        "type": "string",
        "description": "通知提醒内容"
      }
    }
  }
  const oldSchema = input.get(InputIds.Open).schema;
  if(oldSchema !== openSchema){
    input.get(InputIds.Open).setSchema(openSchema);
  }

  return true;
}
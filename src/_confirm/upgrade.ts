import { Data, OutputIds, InputIds } from './constants';

export default function ({
  data,
  output,
  input
}: UpgradeParams<Data>): boolean {

  /**
     * @description v1.0.2 
     */
  const cancelSchema = output.get(OutputIds.Ok).schema;
  if (data.type !== 'confirm' && output.get(OutputIds.Cancel)) {
    output.remove(OutputIds.Cancel);
  }
  if (data.type === 'confirm' && !output.get(OutputIds.Cancel)) {
    output.add(OutputIds.Cancel, '取消', cancelSchema);
  }

  /**
   * @description v1.0.6
   * fix https://my.mybricks.world/mybricks-pc-page/index.html?id=463636034879557
  */
  const inputRels = input.get(InputIds.Open).rels;
  if (!inputRels) {
    input.get(InputIds.Open).setRels(["ok", "cancel"]);
  }

  /**
   * @description v1.0.12 -> v1.0.13 增加description
   * 
  */
  const openSchema = {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "标题文案"
      },
      content: {
        type: "string",
        description: "内容文案"
      },
      cancelText: {
        type: "string",
        description: "取消按钮文案"
      },
      okText: {
        type: "string",
        description: "确认按钮文案"
      },
      outputValue: {
        type: "any",
        description: "输出值内容"
      }
    }
  }
  const oldSchema = input.get(InputIds.Open).schema;
  if(oldSchema !== openSchema){
    input.get(InputIds.Open).setSchema(openSchema);
  }

  return true;
}
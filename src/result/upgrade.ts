import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {

  /**
   * @description v1.0.2 -> v1.0.3 新增修改标题、副标题、状态完成
  */
  if (!output.get("setTitleDone")) {
    output.add("setTitleDone", '修改标题完成', { type: "string" });
  }
  if (output.get("setTitleDone") &&
    input.get("title") &&
    !input.get("title")?.rels?.includes("setTitleDone")) {
    input.get("title").setRels(["setTitleDone"]);
  }

  if (!output.get("setSubTitleDone")) {
    output.add("setSubTitleDone", "修改副标题完成", {type: "string"});
  }
  if (output.get("setSubTitleDone") &&
    input.get("subTitle") &&
    !input.get("subTitle")?.rels?.includes("setSubTitleDone")) {
    input.get("subTitle").setRels(["setSubTitleDone"]);
  }

  if (!output.get("setStatusDone")) {
    output.add("setStatusDone", "修改状态完成", {type: "string"});
  }
  if (output.get("setStatusDone") &&
    input.get("status") &&
    !input.get("status")?.rels?.includes("setStatusDone")) {
    input.get("status").setRels(["setStatusDone"]);
  }

  return true;
}
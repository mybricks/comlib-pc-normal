import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {

  /**
   * @description v1.0.1 -> v1.0.2 新增数据传递完成
  */

  if (!output.get("postDone")) {
    output.add("postDone", '数据传递完成', {type: "follow"});
  }
  if (output.get("postDone") &&
    input.get("post") &&
    !input.get("post")?.rels?.includes("postDone")) {
    input.get("post").setRels(["postDone"]);
  }

  return true;
}
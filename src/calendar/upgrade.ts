import { Data } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {

  /**
   * @description v1.0.2 -> v1.0.3 新增设置数据、选中项完成
  */
  if (!output.get("setDataSourceDone")) {
    output.add("setDataSourceDone", '设置数据源完成', { type: "object" });
  }
  if (output.get("setDataSourceDone") &&
    input.get("dataSource") &&
    !input.get("dataSource")?.rels?.includes("setDataSourceDone")) {
    input.get("dataSource").setRels(["setDataSourceDone"]);
  }

  if (!output.get("setCurrentDateDone")) {
    output.add("setCurrentDateDone", '设置当前日期完成', {type: "number"});
  }
  if (output.get("setCurrentDateDone") &&
    input.get("currentDate") &&
    !input.get("currentDate")?.rels?.includes("setCurrentDateDone")) {
    input.get("currentDate").setRels(["setCurrentDateDone"]);
  }

  return true;
}
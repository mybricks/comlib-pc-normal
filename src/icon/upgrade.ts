import { Data } from './constants';

export default function ({ data, setDeclaredStyle, output, input }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.3 -> v1.0.4, 兼容图标颜色和尺寸
  */

  //兼容颜色和尺寸自定义情况
  if(data.size !== '' && data.color !== ''){
    setDeclaredStyle(`.icon`, { color: data.color, fontSize: data.size});
    data.color = '';
    data.size = '';
  }

  /**
    * @description v1.0.8 -> v1.0.9, 新增动态设置图标
  */
  if (!output.get("setIconDone")) {
    output.add("setIconDone", "设置图标完成", { type: "string" });
  }
  if (!input.get("setIcon")) {
    input.add("setIcon", "设置图标", { type: "string" });
  }
  if (output.get("setIconDone") &&
    input.get("setIcon") &&
    !input.get("setIcon")?.rels?.includes("setIconDone")) {
    input.get("setIcon").setRels(["setIconDone"]);
  }

  return true;
}
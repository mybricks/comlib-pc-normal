import { Data } from './constants';

export default function ({ 
  data, 
  setDeclaredStyle, 
  output, 
  input, 
  style,
  getDeclaredStyle
}: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.3 -> v1.0.4, 兼容图标颜色和尺寸
  */
  //兼容颜色和尺寸自定义情况
  if(data.size && data.color){
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

  /**
    * @description v1.0.11 -> v1.0.12, 拖拽决定图标尺寸
  */
  if(getDeclaredStyle('.icon')?.['css']?.['fontSize']){
    style.width = getDeclaredStyle('.icon')['css']['fontSize'];
  }

  /**
   * @description v1.0.13 新增禁止冒泡开关
  */

  if(typeof data.eventBubble === 'undefined') {
    data.eventBubble = false
  }

  //=========== v1.0.13 end ===============

  return true;
}
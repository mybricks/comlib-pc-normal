import { defineDataSet } from "ai-dataset";
import { MenuModeEnum } from "./constants";

export default defineDataSet((utils) => {
  const result = {};
  result['样式'] = [
    { label: '水平', value: MenuModeEnum.Horizontal },
    { label: '垂直', value: MenuModeEnum.Vertical },
    { label: '内联', value: MenuModeEnum.Inline }
  ].map(item => {
    return {
      Q: `将样式设置为${item.label}`,
      A: { data: { mode: item.value } },
    };
  });

  /** TODO: 复杂编辑项、区域选择器、样式 */
  result['静态数据'] = [];

  return result;
});

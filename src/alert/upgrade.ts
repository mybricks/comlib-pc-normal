import { Data } from './constants';

export default function ({ data }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.0 -> v1.0.1, 新增标题和介绍文案字体样式大小
  */
  if (typeof data.titleStyle === "undefined") {
    data.titleStyle = {
        "color": "rgba(0,0,0,0.85)",
        "fontSize": "16px",
        "lineHeight": "25.144px",
        "fontWeight": 400,
        "fontStyle": "normal",
        "textDecoration": "normal"
      }
  };
  if (typeof data.descriptionStyle === "undefined") {
    data.descriptionStyle = {
        "color": "rgba(67,67,67)",
        "fontSize": "14px",
        "lineHeight": "22px",
        "fontWeight": 400,
        "fontStyle": "normal",
        "textDecoration": "normal"
      }
    //兼容之前颜色自定义情况
    if(data.isColor){
      data.isCustom = true;
      data.descriptionStyle.color = data.textColor
    }
  };
  if (typeof data.isCustom === "undefined") {
    data.isCustom = false;
  };
  if (typeof data.pubType === "undefined") {
    data.pubType = "external";
  };

  return true;
}
import { Data } from './constants';
import { isEmptyObject, differObject } from '../utils';

export default function ({ data, setDeclaredStyle, output, input }: UpgradeParams<Data>): boolean {
  /**
     * @description v1.0.1 -> v1.0.2, 兼容之前默认和激活态颜色自定义
  */

  const defaultStyle = {
    "fontWeight": 400,
    "fontSize": "14px",
    "fontStyle": "normal",
    "lineHeight": "14px",
    "letterSpacing": "0px",
    "color": "#1890ff"
  };

  const defaultHoverStyle = {
    "fontWeight": 400,
    "fontSize": "14px",
    "fontStyle": "normal",
    "lineHeight": "14px",
    "letterSpacing": "0px",
    "color": "#40a9ff"
  };

  if(data.style && !isEmptyObject(data.style)){
    const obj = differObject(data.style, defaultStyle);
    if(!isEmptyObject(obj)){
      setDeclaredStyle(`.linkWrapper`, obj);
    }
    data.style = {}
  }

  if(data.hoverStyle && !isEmptyObject(data.hoverStyle)){
    const obj = differObject(data.hoverStyle, defaultHoverStyle);
    if(!isEmptyObject(obj)){
      setDeclaredStyle(`.linkWrapper:hover`, obj);
    }
    data.hoverStyle = {}
  }

  //1.0.6 -> 1.0.7 新增设置文本内容完成、链接地址完成
  if (!output.get("setContentDone")) {
    output.add("setContentDone", "设置文本内容完成", {type: "string"});
  }
  if (output.get("setContentDone") &&
    input.get("content") &&
    !input.get("content")?.rels?.includes("setContentDone")) {
    input.get("content").setRels(["setContentDone"]);
  }

  if (!output.get("setUrlDone")) {
    output.add("setUrlDone", "设置链接地址完成", {type: "string"});
  }
  if (output.get("setUrlDone") &&
    input.get("url") &&
    !input.get("url")?.rels?.includes("setUrlDone")) {
    input.get("url").setRels(["setUrlDone"]);
  }
  
  return true;
}
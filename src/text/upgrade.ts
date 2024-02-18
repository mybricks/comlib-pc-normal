import { isEmptyObject, differObject } from '../utils';
import { Data } from './constants';

export default function ({ data, config, setDeclaredStyle, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.7 -> v1.0.8, 兼容之前默认和激活态颜色自定义
  */
  const defaultStyle = {
    fontWeight: 400,
    fontSize: '14px',
    fontStyle: 'normal',
    lineHeight: '14px',
    letterSpacing: '0px',
    color: '#000000',
    textAlign: 'left',
  };
  if (!isEmptyObject(data.hoverStyle)) {
    const obj = differObject(data.hoverStyle, data.style);
    if (!isEmptyObject(obj)) {
      setDeclaredStyle(`[data-item-type="root"]:hover`, obj);
    }
    data.hoverStyle = {};
  }
  if (!isEmptyObject(data.style)) {
    const obj = differObject(data.style, defaultStyle);
    if (!isEmptyObject(obj)) {
      setDeclaredStyle(`[data-item-type="root"]`, obj);
    }
    data.style = {};
  }

  /**
   * 兼容configs
   */
  const styleConfig = config.get('style');
  if (styleConfig) {
    styleConfig.setBinding('data.legacyConfigStyle');
  }
  
  /**
    * @description v1.0.13 -> v1.0.14, 增加设置内容完成rels
  */
  if (!output.get("setContentDone")) {
    output.add("setContentDone", '设置内容完成', { type: 'string' });
  }
  if (output.get("setContentDone") &&
    input.get("content") &&
    !input.get("content")?.rels?.includes("setContentDone")) {
    input.get("content").setRels(["setContentDone"]);
  }
  return true;
}
import { Data } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.3 增加列表项数据唯一标识
  */

  if (typeof data.rowKey === "undefined") {
    data.rowKey = "";
  };

  /**
    * @description v1.0.7->1.0.8 增加换行情况下，排列方式，默认纵向
  */
 if(typeof data.layout === "undefined"){
    data.layout = "vertical"
 }

  return true;
}
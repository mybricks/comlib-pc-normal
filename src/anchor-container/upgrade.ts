import { Data, OutputIds, Schemas } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.3 增加固定锚点配置
  */

  if (typeof data.enableFix === "undefined") {
    data.enableFix = true;
  };

  if (typeof data.useDynamicData === "undefined") {
    data.useDynamicData = true;
  };

  /**
    * @description v1.0.7 增加锚点位置配置
  */
  if (typeof data.anchorPosition === "undefined") {
    data.anchorPosition = 'right';
  };

  return true;
}
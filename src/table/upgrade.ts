import { Data } from './types';

export default function ({ data }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.13 增加动态设置表头
  */

  if (typeof data.useDynamicTitle === "undefined") {
    data.useDynamicTitle = false;
  };

  return true;
}
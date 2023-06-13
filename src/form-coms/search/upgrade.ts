import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.7->1.0.8 增加前置下拉框，isSelect、selectWidth、staticOptions
   */
  if (typeof data.isSelect === "undefined") {
    data.isSelect = false;
  };
  if (typeof data.selectWidth === "undefined") {
    data.selectWidth = "150px";
  };
  if (typeof data.staticOptions === "undefined") {
    data.staticOptions = [];
  };

  return true;
}
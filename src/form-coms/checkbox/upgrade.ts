import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    "type": "array"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  /**
    * @description v1.0.3 增加全选框配置
    */
  if (!data.checkAll) {
    data.checkAll = false;
  }
  if (!data.checkAllText) {
    data.checkAllText = '全选';
  }

  /**
   * @description v1.0.10->1.0.11 增加布局（水平或者垂直）
   */
  if (typeof data.layout === "undefined") {
    data.layout = "horizontal";
  };

  /**
   * @description v1.0.13 修复初始时的动态选项
   */
  if (data.config.options !== data.staticOptions) {
    data.config.options = data.staticOptions;
  };

  return true;
}
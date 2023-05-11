import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    "type": "string"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '值初始化', valueSchema);
  }
  output.get('onInitial').setTitle('值初始化');

  /**
   * @description v1.0.11->1.0.12 增加布局（水平或者垂直）
   */
  if (typeof data.layout === "undefined") {
    data.layout = "horizontal";
  };

  return true;
}
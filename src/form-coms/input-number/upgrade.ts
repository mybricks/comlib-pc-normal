import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    "type": "number"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  //1.0.1 -> 1.0.2
  if (!output.get('onBlur')) {
    output.add('onBlur', '失去焦点', valueSchema);
  }
  if (!output.get('onPressEnter')) {
    output.add('onPressEnter', '按下回车', valueSchema);
  }

 /**
   * @description v1.0.10->1.0.11, 新增格式化展示
   */
  if (typeof data.isFormatter === "undefined") {
    data.isFormatter = false;
  }
  if (typeof data.charPostion === "undefined") {
    data.charPostion = "prefix"
  }
  if (typeof data.character === "undefined") {
    data.character = "¥"
  }

  return true;
}
import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    "type": "string"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  if (!output.get('onPressEnter')) {
    output.add('onPressEnter', '按下回车', valueSchema);
  }

  return true;
}
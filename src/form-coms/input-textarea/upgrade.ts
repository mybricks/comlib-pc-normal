import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {

  if (typeof data.minRows === "undefined") {
    data.minRows = 3;
  };
  if (typeof data.maxRows === "undefined") {
    data.maxRows = 6;
  };

  const valueSchema = {
    "type": "string"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  return true;
}
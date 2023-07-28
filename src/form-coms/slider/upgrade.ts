import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {

  // 1.0.0 -> 1.0.1
  let valueSchema: {} = {
    type: 'number'
  }
  if (data.config.range) {
    valueSchema = {
      type: 'array',
      items: {
        type: 'number'
      }
    };
  }
  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }
  if (!output.get('onInitial')) {
    output.add('onInitial', '值初始化', valueSchema);
  }
  output.get('onInitial').setTitle('值初始化');

  return true;
}
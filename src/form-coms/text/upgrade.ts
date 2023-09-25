import { Data } from './runtime';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    type: 'string'
  };

  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '值初始化', valueSchema);
  }
  output.get('onInitial').setTitle('值初始化');

  if (!output.get('onPressEnter')) {
    output.add('onPressEnter', '按下回车', valueSchema);
  }

  /**
   * @description v1.0.9->v1.0.10 增加尺寸
   */
  if (typeof data.config.size === 'undefined') {
    data.config.size = 'middle';
  }

  /**
   * v1.2.11 -> v1.2.12 增加「设置字体颜色」能力
   */
  if (!input.get('setColor')) {
    input.add('setColor', '设置字体颜色', valueSchema);
  }

  /**
   * @description v1.2.13->v1.2.14 新增后缀图标, src——图标来源，innerIcon——内置图标
   */
  if (typeof data.src === 'undefined') {
    data.src = false;
  }
  if (typeof data.innerIcon === 'undefined') {
    data.innerIcon = "HomeOutlined";
  }

  return true;
}

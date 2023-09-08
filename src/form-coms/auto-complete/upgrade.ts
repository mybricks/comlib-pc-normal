import { InputIds } from '../types';
import { Data } from './runtime';

const valueSchema = {
  type: 'string'
};

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.3 统一“设置数据源”、“设置值”、“设置初始值”、“值初始化”的schema
  */
  const dataSourceSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        label: {
          title: '标签',
          type: 'string',
        },
        value: {
          title: '值',
          type: 'string',
        }
      },
    },
  };
  input.get('setOptions').setSchema(dataSourceSchema);

  data.staticOptions.map((item)=>{
    if(!item.label){
      item.label = item.value
    }
  })

  /**
    * @description v1.0.7->1.0.8 增加值选择
  */
  if (!output.get('onSelect')) {
    output.add('onSelect', '值选择', { type: "any"});
  }

  /**
   * v1.0.8 -> v1.0.9 增加「设置字体颜色」能力
   */
  if (!input.get('setColor')) {
    input.add('setColor', '设置字体颜色', valueSchema);
  }

  return true;
}
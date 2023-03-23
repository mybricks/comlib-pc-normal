import { Data } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.2 增加“设置数据源”和“设置标题”默认schema
  */

  const titleSchema = {
    "type": "string"
  }

  const dataSourceSchema = {
    "type": "object",
    "properties": {
      "field1": {
        "type": "string"
      }
    }
  }

  if (!input.get('setTitle')) {
    input.add('setTitle', '设置标题', titleSchema);
  }

  if (!output.get('setDataSource')) {
    output.add('setDataSource', '设置数据源', dataSourceSchema);
  }

  return true;
}
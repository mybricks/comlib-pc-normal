import { Data } from './constants';

export default function ({ input, output }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.3 , 新增按钮动态标题
  */
  const valueSchema = {
    "type": "string"
  }
  if (!input.get('dynamicTitle')) {
    input.add('dynamicTitle', '设置标题', valueSchema);
  }
  return true;
}
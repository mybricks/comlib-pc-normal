import { Data, OutputIds } from './constants';

export default function ({ input, output, data }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.3 , 新增按钮动态标题
  */
  const valueSchema = {
    "type": "string"
  }
  if (!input.get('dynamicTitle')) {
    input.add('dynamicTitle', '设置标题', valueSchema);
  }

  /**
   * @description v1.0.5 , fix setSchema问题
  */
  const click = output.get(OutputIds.Click);
  const dbClick = output.get(OutputIds.DbClick);
  if (data.dataType === 'number') {
    click.setSchema({
      type: 'number'
    });
    dbClick.setSchema({
      type: 'number'
    });
  }
  return true;
}
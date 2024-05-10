export default function ({
  id,
  data,
  slot,
  input,
  output,
  config,
  setDeclaredStyle,
  getDeclaredStyle,
  removeDeclaredStyle
}: UpgradeParams<any>): boolean {
  const exportComplete = output.get('exportComplete');
  if (!exportComplete) {
    output.add('exportComplete', '完成', { type: 'any' });
    input.get('dataSource').setRels(['exportComplete']);
  }

  /**
   * @description v1.0.3 -> v1.0.4 新增动态设置导出文件名
  */
  if(data.useDynamicFilename === undefined) {
    data.useDynamicFilename = false;
  }

  return true;
}

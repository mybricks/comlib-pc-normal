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
  return true;
}

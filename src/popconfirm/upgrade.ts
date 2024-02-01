import { Data } from './types';
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
}: UpgradeParams<Data>): boolean {
  const titleInput = input.get('title');
  if (titleInput) {
    output.add('titleComplete', '完成', { type: 'any' });
    titleInput.setRels(['titleComplete']);
  }
  return true;
}

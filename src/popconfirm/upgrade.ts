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
  const setTitleComplete = output.get('setTitleComplete')
  if(!setTitleComplete) {
    output.add('setTitleComplete', '完成', {type: 'any'})
    input.get('title').setRels(['setTitleComplete']);
  }
  return true;
}

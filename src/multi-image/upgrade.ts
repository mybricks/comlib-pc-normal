import { Data, InputIds } from './constants';
import { isEmptyObject } from '../utils'

export default function ({
  data,
  input,
  output,
  setDeclaredStyle
}: UpgradeParams<Data>): boolean {
  return true;
}
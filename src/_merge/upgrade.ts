import { Data } from './constants';
import { uuid } from '../utils';
export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  if (input.get()?.length === 1) {
    input.add(uuid(), '输入项1', {
      type: 'follow'
    });
  }
  return true;
}
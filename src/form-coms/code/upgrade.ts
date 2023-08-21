import { Data } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  if(!data.hasOwnProperty('rules')) {
    data.rules = []
  }
  return true;
}

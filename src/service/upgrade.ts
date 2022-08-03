import { Data } from './constants';

export default function ({
  data,
  isAutoRun,
  setAutoRun
}: UpgradeParams<Data>): boolean {

  return true;
}

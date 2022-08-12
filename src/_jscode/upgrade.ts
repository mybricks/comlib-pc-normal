import { Data } from './constants';

export default function ({
  data,
  isAutoRun,
  setAutoRun
}: UpgradeParams<Data>): boolean {
  // 1.0.0 -> 1.0.1
  // 1.0.1 -> 1.0.2
  if (data.runImmediate && isAutoRun && !isAutoRun()) {
    setAutoRun(true);
  }

  return true;
}

import { Data } from './types';

export default function ({ data }: UpgradeParams<Data>): boolean {
  data.picks = data.picks.map((pick) => ({ ...pick, expression: `{${pick.expression}}` }));
  return true;
}

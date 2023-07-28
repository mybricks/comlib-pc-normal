import { Data } from './types';

export default function ({ data }: UpgradeParams<Data>): boolean {
  data.picks = data.picks.map((pick) => {
    const expression =
      pick.expression.startsWith('{') && pick.expression.endsWith('}')
        ? pick.expression
        : `{${pick.expression}}`;
    return { ...pick, expression };
  });
  return true;
}

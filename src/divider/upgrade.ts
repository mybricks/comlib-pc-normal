import { DataType } from './constants';

export default function ({ data, output, input }: UpgradeParams<DataType>): boolean {
  return true;
}

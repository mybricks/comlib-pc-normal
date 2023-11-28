import { Data, EnumStorage } from './types';

export default function ({ data }: UpgradeParams<Data>): boolean {
  if (!data.storageType) {
    data.storageType = EnumStorage.LOCAL
  }
  return true;
}

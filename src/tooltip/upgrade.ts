import { Data } from './types';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  setDeclaredStyle('.ant-tooltip-arrow-content, .ant-tooltip-inner', { ...data.style });
  return true;
}
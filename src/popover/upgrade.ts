import { Data } from './constants';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  setDeclaredStyle('.ant-popover-arrow-content, .ant-popover-inner .ant-popover-inner-content', { ...data.style });
  return true;
}
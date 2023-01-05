import { Data } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  if (!input.get('download')) {
    input.add('download', '下载二维码', { type: 'any' });
  }
  if (data.renderAs === 'svg') {
    data.renderAs = 'canvas';
  }
  return true;
}

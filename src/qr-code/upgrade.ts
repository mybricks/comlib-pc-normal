import { Data } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  if (!input.get('download')) {
    input.add('download', '下载二维码', { type: 'any' });
  }
  if (data.renderAs === 'svg') {
    data.renderAs = 'canvas';
  }

  const setLinkComplete = output.get('setLinkComplete')
  if(!setLinkComplete) {
    output.add('setLinkComplete', '完成', {type: 'any'})
    input.get('link').setRels(['setLinkComplete'])
  }

  const downloadComplete = output.get('downloadComplete')
  if(!downloadComplete) {
    output.add('downloadComplete', '完成', {type: 'any'})
    input.get('download').setRels(['downloadComplete'])
  }

  return true;
}

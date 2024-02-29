import { Data } from './types';
import { isEmptyObject } from '../utils';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if (!isEmptyObject(data.style)) {
    setDeclaredStyle('[data-root="root"] > div,[data-root="root"] > video', { ...data.style });
    data.style = {};
  }
  if (!input.get('link')) {
    input.add('link', '设置视频链接', {
      type: 'string'
    });
  }

  const setLinkComplete = output.get('setLinkComplete');
  if (!setLinkComplete) {
    output.add('setLinkComplete', '完成', { type: 'any' });
    input.get('link').setRels(['setLinkComplete']);
  }

  const screenshotComplete = output.get('screenshotComplete')
  if(!screenshotComplete) {
    output.add('screenshotComplete', '完成', {type: 'any'})
    input.get('screenshot').setRels(['screenshotComplete'])
  }

  return true;
}

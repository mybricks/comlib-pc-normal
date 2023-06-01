import { Data } from './types';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  setDeclaredStyle('[data-root="root"] > div,[data-root="root"] > video', { ...data.style });
  if (!input.get('link')) {
    input.add('link', '设置视频链接', {
      type: 'string'
    });
  }
  return true;
}

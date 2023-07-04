import { Data } from './runtime';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if (!input.get('content')) {
    input.add('content', '内容', { type: 'string' });
  }
  return true;
}

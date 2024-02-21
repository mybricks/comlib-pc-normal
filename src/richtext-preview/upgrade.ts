import { Data } from './runtime';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if (!input.get('content')) {
    input.add('content', '内容', { type: 'string' });
  }

  // 补全 output => contentDone
  if (!output.get('contentDone')) {
    output.add('contentDone', '输入富文本内容完成', {
      type: 'string'
    });
  }
  // 补全 rels => content-contentDone
  if (
    output.get('contentDone') &&
    input.get('content') &&
    !input.get('content')?.rels?.includes('contentDone')
  ) {
    input.get('content').setRels(['contentDone']);
  }

  return true;
}

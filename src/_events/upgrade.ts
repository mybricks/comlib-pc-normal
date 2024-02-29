import { Data } from './types';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if (!input.get('run')) {
    input.add('run', '弹出提示', {
      type: 'any'
    });
  }

  // 补全 output => runDone
  if (!output.get('runDone')) {
    output.add('runDone', '触发事件完成', {
      type: 'any'
    });
  }
  // 补全 rels => run-runDone
  if (
    output.get('runDone') &&
    input.get('run') &&
    !input.get('run')?.rels?.includes('runDone')
  ) {
    input.get('run').setRels(['runDone']);
  }

  return true;
}

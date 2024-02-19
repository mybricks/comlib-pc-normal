import { Data } from './runtime';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if (!input.get('inputSettings')) {
    input.add('inputSettings', '初始化', { type: 'string' });
  }

  // 补全 output => inputSettingsDone
  if (!output.get('inputSettingsDone')) {
    output.add('inputSettingsDone', '初始化完成', {
      type: 'string'
    });
  }
  // 补全 rels => inputSettings-inputSettingsDone
  if (
    output.get('inputSettingsDone') &&
    input.get('inputSettings') &&
    !input.get('inputSettings')?.rels?.includes('inputSettingsDone')
  ) {
    input.get('inputSettings').setRels(['inputSettingsDone']);
  }

  return true;
}

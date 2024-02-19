import { Data } from './constants';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  if (!input.get('showMsg')) {
    input.add('showMsg', '弹出提示', {
      type: 'follow'
    });
  }

  // 补全 output => showMsgDone
  if (!output.get('showMsgDone')) {
    output.add('showMsgDone', '弹出提示完成', {
      type: 'follow'
    });
  }
  // 补全 rels => showMsg-showMsgDone
  if (
    output.get('showMsgDone') &&
    input.get('showMsg') &&
    !input.get('showMsg')?.rels?.includes('showMsgDone')
  ) {
    input.get('showMsg').setRels(['showMsgDone']);
  }

  return true;
}

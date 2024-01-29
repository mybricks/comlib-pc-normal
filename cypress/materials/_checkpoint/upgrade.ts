export default function ({ data, output }: UpgradeParams<any>): boolean {
  if (!output.get('export')) {
    output.add('export', '出口', {
      type: 'follow'
    });
  }

  return true;
}

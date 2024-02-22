export default function ({ input, output, slot, data }): boolean {
  // 补全 output => routerActionDone
  if (!output.get('routerActionDone')) {
    output.add('routerActionDone', '路由切换完成', {
      type: 'any'
    });
  }

  // 补全 rels => routerAction-routerActionDone
  if (
    output.get('routerActionDone') &&
    input.get('routerAction') &&
    !input.get('routerAction')?.rels?.includes('routerActionDone')
  ) {
    input.get('routerAction').setRels(['routerActionDone']);
  }

  return true;
}

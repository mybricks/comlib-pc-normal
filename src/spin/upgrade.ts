export default function ({ input, output, slot, data }): boolean {
  // 补全 output => openLoadingDone
  if (!output.get('openLoadingDone')) {
    output.add('openLoadingDone', '开始加载后', {
      type: 'any'
    });
  }

  // 补全 rels => openLoading-openLoadingDone
  if (
    output.get('openLoadingDone') &&
    input.get('openLoading') &&
    !input.get('openLoading')?.rels?.includes('openLoadingDone')
  ) {
    input.get('openLoading').setRels(['openLoadingDone']);
  }

  // 补全 output => closeLoadingDone
  if (!output.get('closeLoadingDone')) {
    output.add('closeLoadingDone', '结束加载后', {
      type: 'any'
    });
  }

  // 补全 rels => closeLoading-closeLoadingDone
  if (
    output.get('closeLoadingDone') &&
    input.get('closeLoading') &&
    !input.get('closeLoading')?.rels?.includes('closeLoadingDone')
  ) {
    input.get('closeLoading').setRels(['closeLoadingDone']);
  }

  return true;
}

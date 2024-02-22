export default function ({ input, output, slot, data }): boolean {
  /**
   * @description v1.0.1 , 新增id
  */
  if (typeof data.id === "undefined") {
    data.id = "iframe";
  };

    // 补全 output => setUrlDone
    if (!output.get('setUrlDone')) {
      output.add('setUrlDone', '输入链接完成', {
        type: 'string'
      });
    }
    // 补全 rels => setUrl-setUrlDone
    if (
      output.get('setUrlDone') &&
      input.get('setUrl') &&
      !input.get('setUrl')?.rels?.includes('setUrlDone')
    ) {
      input.get('setUrl').setRels(['setUrlDone']);
    }
  
  return true;
}
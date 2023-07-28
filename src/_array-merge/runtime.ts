export default ({ inputs, outputs, onError }: RuntimeParams<{}>) => {
  inputs['input']((val: Record<string, Array<any>>) => {
    try {
      if (!Object.keys(val).every((key) => Array.isArray(val[key])))
        throw new Error('输入参数必须是数组');
      const result: any[] = [];
      for (const value of Object.values(val)) {
        result.push(...value);
      }
      outputs['output'](result);
    } catch (ex: any) {
      onError?.(ex);
    }
  });
};

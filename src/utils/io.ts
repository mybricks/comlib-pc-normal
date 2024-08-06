/**
 * 组件的outputs没有连接才执行内部回调
 */
export const createOutputCbIfNoConnect = ({ getOutputs, eventName, cb }) => {
  return (val) => {
    const cons = getOutputs()?.[eventName]?.getConnections();
    if (Array.isArray(cons) && cons.length) {
      return;
    }
    return cb(val);
  };
};

/**
 * 
 * @description IO串行处理 为输入增加串行输出
 * @param relOutputs 
 * @param outputs 
 * @param OutputId 
 * @param val 
 */
export const handleOutputFn = (
  relOutputs: { [x: string]: any },
  outputs: { [x: string]: any },
  OutputId: string,
  val: any
) => {
  const outputFn = relOutputs?.[OutputId] || outputs[OutputId];
  if (outputFn) {
    outputFn(val);
  }
};

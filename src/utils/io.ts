/**
 * 组件的outputs没有连接才执行内部回调
 */
export const createOutputCbIfNoConnect = ({ getOutputs, eventName, cb }) => {

  return val => {
    const cons = getOutputs()?.[eventName]?.getConnections()
    if (Array.isArray(cons) && cons.length) {
      return
    }
    return cb(val)
  }
}
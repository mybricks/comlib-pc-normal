import { originformItemList } from "./const";


export default ({ env, data, inputs, outputs, logger, onError }) => {
  const beginOutput = () => {
    if (!data.formItemList?.length) {
      console.log(`data`, data, 'env', env)
      logger.error(`请选择需要的表单项`)
      onError(new Error(`请选择需要的表单项`))
      return
    }
    return outputs.formItemList(data.formItemList.map(item => originformItemList.find(i => i.namespace === item)).map(j => ({
      label: j.title,
      value: j.namespace
    })))
  }
  if (data.runImmediate && env.runtime) {
    beginOutput()

  }
  inputs.start(() => {
    beginOutput()
  });
};
